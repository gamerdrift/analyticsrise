import { parseSql } from './parser';
import { SelectStatement, SelectColumn, Expression, FunctionCallExpr } from './ast';
import { Database, Table, QueryResult, Row, SqlValue } from './types';
import { evaluateExpression, compareSqlValues, executeScalarFunction } from './evaluator';
import { SQLError } from './errors';

/**
 * Checks if an expression contains aggregate function calls
 */
export function hasAggregateFunction(expr: Expression): boolean {
  if (expr.type === 'FUNCTION_CALL') {
    if (['COUNT', 'SUM', 'AVG', 'MIN', 'MAX'].includes(expr.name.toUpperCase())) {
      return true;
    }
    return expr.args.some(hasAggregateFunction);
  }
  if (expr.type === 'BINARY_OP') {
    return hasAggregateFunction(expr.left) || hasAggregateFunction(expr.right);
  }
  if (expr.type === 'UNARY_OP' || expr.type === 'IS_NULL') {
    return hasAggregateFunction(expr.expr);
  }
  if (expr.type === 'CASE') {
    return (
      expr.conditions.some((c) => hasAggregateFunction(c.when) || hasAggregateFunction(c.then)) ||
      (expr.elseExpr ? hasAggregateFunction(expr.elseExpr) : false)
    );
  }
  return false;
}

/**
 * Collects all aggregate expressions in an AST subtree
 */
export function collectAggregates(expr: Expression): FunctionCallExpr[] {
  const aggs: FunctionCallExpr[] = [];
  function traverse(node: Expression) {
    if (node.type === 'FUNCTION_CALL') {
      if (['COUNT', 'SUM', 'AVG', 'MIN', 'MAX'].includes(node.name.toUpperCase())) {
        aggs.push(node);
      } else {
        node.args.forEach(traverse);
      }
      return;
    }
    if (node.type === 'BINARY_OP') {
      traverse(node.left);
      traverse(node.right);
    } else if (node.type === 'UNARY_OP' || node.type === 'IS_NULL') {
      traverse(node.expr);
    } else if (node.type === 'CASE') {
      node.conditions.forEach((c) => {
        traverse(c.when);
        traverse(c.then);
      });
      if (node.elseExpr) traverse(node.elseExpr);
    }
  }
  traverse(expr);
  return aggs;
}

/**
 * Generates a standard display name for a SELECT expression
 */
export function getExpressionName(expr: Expression): string {
  switch (expr.type) {
    case 'COLUMN_REF':
      return expr.column;
    case 'STAR':
      return expr.table ? `${expr.table}.*` : '*';
    case 'LITERAL':
      return String(expr.value);
    case 'FUNCTION_CALL':
      return `${expr.name}(${expr.args.map(getExpressionName).join(', ')})`;
    case 'BINARY_OP':
      return `${getExpressionName(expr.left)} ${expr.operator} ${getExpressionName(expr.right)}`;
    case 'CASE':
      return 'CASE';
    default:
      return 'col';
  }
}

interface IntermediateRow {
  outputRow: Row;
  scopeRow: Row;
  evaluator: (expr: Expression) => SqlValue;
}

/**
 * Executes a SELECT query against an in-memory Database
 */
export function executeSql(sql: string, db: Database): QueryResult {
  const startTime = performance.now();
  const warnings: string[] = [];

  // 1. Parse AST
  const ast = parseSql(sql);

  // 2. Base Data Collection & Table Aliasing
  let currentRows: Row[] = [];
  const tableAliasMap: Record<string, string> = {}; // alias -> tableName

  if (!ast.from) {
    // SELECT without FROM (e.g. SELECT 1 + 1 AS res;)
    currentRows = [{}];
  } else {
    const tableName = ast.from.table.toLowerCase();
    const tableObj = Object.values(db.tables).find((t) => t.name.toLowerCase() === tableName);

    if (!tableObj) {
      throw new SQLError({
        code: 'TABLE_NOT_FOUND',
        message: `Table '${ast.from.table}' does not exist in database '${db.name}'.`,
        line: ast.from.table.length,
        hint: `Available tables in current schema: ${Object.keys(db.tables).join(', ')}`,
      });
    }

    const basePrefix = ast.from.alias ? ast.from.alias.toLowerCase() : tableName;
    if (ast.from.alias) {
      tableAliasMap[ast.from.alias.toLowerCase()] = tableName;
    }

    // Prefix base table columns
    currentRows = tableObj.rows.map((r) => {
      const prefixed: Row = {};
      for (const [k, v] of Object.entries(r)) {
        prefixed[k.toLowerCase()] = v;
        prefixed[`${basePrefix}.${k.toLowerCase()}`] = v;
        prefixed[`${tableName}.${k.toLowerCase()}`] = v;
      }
      return prefixed;
    });

    // 3. Process JOINs
    for (const join of ast.joins) {
      const joinTableName = join.table.table.toLowerCase();
      const joinTableObj = Object.values(db.tables).find((t) => t.name.toLowerCase() === joinTableName);

      if (!joinTableObj) {
        throw new SQLError({
          code: 'TABLE_NOT_FOUND',
          message: `Joined table '${join.table.table}' does not exist.`,
          hint: `Available tables: ${Object.keys(db.tables).join(', ')}`,
        });
      }

      const joinPrefix = join.table.alias ? join.table.alias.toLowerCase() : joinTableName;
      if (join.table.alias) {
        tableAliasMap[join.table.alias.toLowerCase()] = joinTableName;
      }

      const joinedRows: Row[] = [];

      for (const leftRow of currentRows) {
        let matched = false;

        for (const rightRow of joinTableObj.rows) {
          // Construct merged row candidate
          const mergedRow: Row = { ...leftRow };
          for (const [k, v] of Object.entries(rightRow)) {
            mergedRow[k.toLowerCase()] = v;
            mergedRow[`${joinPrefix}.${k.toLowerCase()}`] = v;
            mergedRow[`${joinTableName}.${k.toLowerCase()}`] = v;
          }

          if (join.type === 'CROSS') {
            joinedRows.push(mergedRow);
            matched = true;
          } else if (join.on) {
            const onResult = evaluateExpression(join.on, { row: mergedRow, tableAliases: tableAliasMap });
            if (onResult === true) {
              joinedRows.push(mergedRow);
              matched = true;
            }
          }
        }

        // Handle LEFT JOIN unmatched rows
        if (!matched && join.type === 'LEFT') {
          const nullPaddedRow: Row = { ...leftRow };
          for (const col of joinTableObj.columns) {
            nullPaddedRow[col.name.toLowerCase()] = null;
            nullPaddedRow[`${joinPrefix}.${col.name.toLowerCase()}`] = null;
            nullPaddedRow[`${joinTableName}.${col.name.toLowerCase()}`] = null;
          }
          joinedRows.push(nullPaddedRow);
        }
      }

      currentRows = joinedRows;
    }
  }

  // 4. Apply WHERE Filter
  if (ast.where) {
    currentRows = currentRows.filter((row) => {
      const condResult = evaluateExpression(ast.where!, { row, tableAliases: tableAliasMap });
      return condResult === true;
    });
  }

  // 5. Check Aggregations & Grouping
  const hasAggInSelect = ast.columns.some((c) => hasAggregateFunction(c.expr));
  const hasAggInHaving = ast.having ? hasAggregateFunction(ast.having) : false;
  const isAggregateQuery = ast.groupBy !== undefined || hasAggInSelect || hasAggInHaving;

  let intermediateRows: IntermediateRow[] = [];

  if (isAggregateQuery) {
    let groupedRecords: { groupKey: string; representativeRow: Row; rows: Row[] }[] = [];

    if (ast.groupBy && ast.groupBy.length > 0) {
      // Group by specified expressions
      const groupsMap = new Map<string, { representativeRow: Row; rows: Row[] }>();

      for (const row of currentRows) {
        const keyVals = ast.groupBy.map((gExpr) =>
          String(evaluateExpression(gExpr, { row, tableAliases: tableAliasMap }))
        );
        const groupKey = keyVals.join(':::');

        if (!groupsMap.has(groupKey)) {
          groupsMap.set(groupKey, { representativeRow: row, rows: [] });
        }
        groupsMap.get(groupKey)!.rows.push(row);
      }

      groupedRecords = Array.from(groupsMap.entries()).map(([groupKey, data]) => ({
        groupKey,
        representativeRow: data.representativeRow,
        rows: data.rows,
      }));
    } else {
      // Single aggregate group across all rows
      groupedRecords = [
        {
          groupKey: '__ALL__',
          representativeRow: currentRows[0] || {},
          rows: currentRows,
        },
      ];
    }

    for (const group of groupedRecords) {
      // Compute aggregate values for this group bucket
      const aggValues = new Map<FunctionCallExpr, SqlValue>();

      // Collect all aggregate functions in SELECT, HAVING, ORDER BY
      const allAggs: FunctionCallExpr[] = [];
      ast.columns.forEach((c) => allAggs.push(...collectAggregates(c.expr)));
      if (ast.having) allAggs.push(...collectAggregates(ast.having));
      if (ast.orderBy) {
        ast.orderBy.forEach((o) => allAggs.push(...collectAggregates(o.expr)));
      }

      for (const agg of allAggs) {
        const fnName = agg.name.toUpperCase();

        if (fnName === 'COUNT') {
          if (agg.args.length === 0 || agg.args[0].type === 'STAR') {
            aggValues.set(agg, group.rows.length);
          } else {
            const values = group.rows
              .map((r) => evaluateExpression(agg.args[0], { row: r, tableAliases: tableAliasMap }))
              .filter((v) => v !== null && v !== undefined);

            if (agg.distinct) {
              const unique = new Set(values);
              aggValues.set(agg, unique.size);
            } else {
              aggValues.set(agg, values.length);
            }
          }
        } else if (fnName === 'SUM') {
          const values = group.rows
            .map((r) => evaluateExpression(agg.args[0], { row: r, tableAliases: tableAliasMap }))
            .filter((v) => v !== null && v !== undefined)
            .map(Number)
            .filter((n) => !isNaN(n));

          if (values.length === 0) {
            aggValues.set(agg, null);
          } else {
            const sum = values.reduce((a, b) => a + b, 0);
            aggValues.set(agg, sum);
          }
        } else if (fnName === 'AVG') {
          const values = group.rows
            .map((r) => evaluateExpression(agg.args[0], { row: r, tableAliases: tableAliasMap }))
            .filter((v) => v !== null && v !== undefined)
            .map(Number)
            .filter((n) => !isNaN(n));

          if (values.length === 0) {
            aggValues.set(agg, null);
          } else {
            const sum = values.reduce((a, b) => a + b, 0);
            aggValues.set(agg, sum / values.length);
          }
        } else if (fnName === 'MIN') {
          const values = group.rows
            .map((r) => evaluateExpression(agg.args[0], { row: r, tableAliases: tableAliasMap }))
            .filter((v) => v !== null && v !== undefined);

          if (values.length === 0) {
            aggValues.set(agg, null);
          } else {
            let minVal = values[0];
            for (const val of values) {
              if (compareSqlValues(val, minVal, '<') === true) {
                minVal = val;
              }
            }
            aggValues.set(agg, minVal);
          }
        } else if (fnName === 'MAX') {
          const values = group.rows
            .map((r) => evaluateExpression(agg.args[0], { row: r, tableAliases: tableAliasMap }))
            .filter((v) => v !== null && v !== undefined);

          if (values.length === 0) {
            aggValues.set(agg, null);
          } else {
            let maxVal = values[0];
            for (const val of values) {
              if (compareSqlValues(val, maxVal, '>') === true) {
                maxVal = val;
              }
            }
            aggValues.set(agg, maxVal);
          }
        }
      }

      // Helper evaluator for group scope with precomputed aggregates and scalar functions
      const evalGroupExpr = (exprNode: Expression): SqlValue => {
        if (exprNode.type === 'FUNCTION_CALL') {
          if (aggValues.has(exprNode)) {
            return aggValues.get(exprNode)!;
          }
          const evaluatedArgs = exprNode.args.map(evalGroupExpr);
          return executeScalarFunction(exprNode.name, evaluatedArgs, exprNode.line, exprNode.colOffset);
        }
        if (exprNode.type === 'BINARY_OP') {
          const op = exprNode.operator.toUpperCase();
          if (op === 'AND') {
            const leftVal = evalGroupExpr(exprNode.left);
            if (leftVal === false) return false;
            const rightVal = evalGroupExpr(exprNode.right);
            if (rightVal === false) return false;
            if (leftVal === null || rightVal === null) return null;
            return Boolean(leftVal && rightVal);
          }
          if (op === 'OR') {
            const leftVal = evalGroupExpr(exprNode.left);
            if (leftVal === true) return true;
            const rightVal = evalGroupExpr(exprNode.right);
            if (rightVal === true) return true;
            if (leftVal === null && rightVal === null) return null;
            return Boolean(leftVal || rightVal);
          }
          const left = evalGroupExpr(exprNode.left);
          const right = evalGroupExpr(exprNode.right);
          if (['=', '!=', '<>', '<', '<=', '>', '>='].includes(op)) {
            return compareSqlValues(left, right, op);
          }
          if (left === null || right === null) return null;
          const numA = Number(left);
          const numB = Number(right);
          if (isNaN(numA) || isNaN(numB)) return null;
          switch (op) {
            case '+': return numA + numB;
            case '-': return numA - numB;
            case '*': return numA * numB;
            case '/': return numB === 0 ? null : numA / numB;
            case '%': return numB === 0 ? null : numA % numB;
            default: return null;
          }
        }
        if (exprNode.type === 'IS_NULL') {
          const val = evalGroupExpr(exprNode.expr);
          const isNull = val === null || val === undefined;
          return exprNode.not ? !isNull : isNull;
        }
        if (exprNode.type === 'CASE') {
          for (const clause of exprNode.conditions) {
            const condResult = evalGroupExpr(clause.when);
            if (condResult === true) {
              return evalGroupExpr(clause.then);
            }
          }
          if (exprNode.elseExpr) {
            return evalGroupExpr(exprNode.elseExpr);
          }
          return null;
        }
        return evaluateExpression(exprNode, { row: group.representativeRow, tableAliases: tableAliasMap });
      };

      // 6. Apply HAVING Filter
      if (ast.having) {
        const havingPass = evalGroupExpr(ast.having);
        if (havingPass !== true) {
          continue;
        }
      }

      // 7. Build output row
      const outputRow: Row = {};
      for (const col of ast.columns) {
        if (col.expr.type === 'STAR') {
          Object.assign(outputRow, group.representativeRow);
        } else {
          const colName = col.alias || getExpressionName(col.expr);
          outputRow[colName] = evalGroupExpr(col.expr);
        }
      }

      intermediateRows.push({
        outputRow,
        scopeRow: group.representativeRow,
        evaluator: evalGroupExpr,
      });
    }
  } else {
    // Non-aggregate query
    for (const row of currentRows) {
      const outputRow: Row = {};
      for (const col of ast.columns) {
        if (col.expr.type === 'STAR') {
          if (col.expr.table) {
            // table.*
            const tblPrefix = col.expr.table.toLowerCase();
            for (const [k, v] of Object.entries(row)) {
              if (k.startsWith(`${tblPrefix}.`)) {
                const rawCol = k.substring(tblPrefix.length + 1);
                outputRow[rawCol] = v;
              }
            }
          } else {
            // General *
            for (const [k, v] of Object.entries(row)) {
              // Add only unqualified keys
              if (!k.includes('.')) {
                outputRow[k] = v;
              }
            }
          }
        } else {
          const colName = col.alias || getExpressionName(col.expr);
          outputRow[colName] = evaluateExpression(col.expr, { row, tableAliases: tableAliasMap });
        }
      }

      intermediateRows.push({
        outputRow,
        scopeRow: row,
        evaluator: (e: Expression) => evaluateExpression(e, { row, tableAliases: tableAliasMap }),
      });
    }
  }

  // 8. Apply DISTINCT
  if (ast.distinct && intermediateRows.length > 0) {
    const seen = new Set<string>();
    const distinctRows: IntermediateRow[] = [];
    for (const item of intermediateRows) {
      const serialized = JSON.stringify(item.outputRow);
      if (!seen.has(serialized)) {
        seen.add(serialized);
        distinctRows.push(item);
      }
    }
    intermediateRows = distinctRows;
  }

  // 9. Apply ORDER BY (can sort by projected output columns, alias, or original scope rows)
  if (ast.orderBy && ast.orderBy.length > 0) {
    intermediateRows.sort((itemA, itemB) => {
      for (const orderItem of ast.orderBy!) {
        const orderColName = getExpressionName(orderItem.expr);

        let valA: SqlValue;
        let valB: SqlValue;

        if (orderColName in itemA.outputRow) {
          valA = itemA.outputRow[orderColName];
          valB = itemB.outputRow[orderColName];
        } else {
          valA = itemA.evaluator(orderItem.expr);
          valB = itemB.evaluator(orderItem.expr);
        }

        if (valA === valB) continue;

        // Handle NULL sorting
        if (valA === null || valA === undefined) {
          const nullsFirst = orderItem.nulls === 'FIRST' || (orderItem.direction === 'ASC' && !orderItem.nulls);
          return nullsFirst ? -1 : 1;
        }
        if (valB === null || valB === undefined) {
          const nullsFirst = orderItem.nulls === 'FIRST' || (orderItem.direction === 'ASC' && !orderItem.nulls);
          return nullsFirst ? 1 : -1;
        }

        const isLess = compareSqlValues(valA, valB, '<') === true;
        if (orderItem.direction === 'ASC') {
          return isLess ? -1 : 1;
        } else {
          return isLess ? 1 : -1;
        }
      }
      return 0;
    });
  }

  // 10. Apply LIMIT & OFFSET
  if (ast.offset !== undefined || ast.limit !== undefined) {
    const start = ast.offset || 0;
    const end = ast.limit !== undefined ? start + ast.limit : undefined;
    intermediateRows = intermediateRows.slice(start, end);
  }

  // 11. Extract Final Output Rows & Columns Matrix
  const finalRows: Row[] = intermediateRows.map((item) => item.outputRow);

  let columnNames: string[] = [];
  if (finalRows.length > 0) {
    columnNames = Object.keys(finalRows[0]);
  } else if (ast.columns.length > 0) {
    columnNames = ast.columns
      .filter((c) => c.expr.type !== 'STAR')
      .map((c) => c.alias || getExpressionName(c.expr));
  }

  const rows2D: SqlValue[][] = finalRows.map((r) => columnNames.map((c) => r[c] ?? null));

  return {
    columns: columnNames,
    rows: rows2D,
    rowObjects: finalRows,
    rowCount: finalRows.length,
    executionMs: Math.max(0.1, performance.now() - startTime),
    warnings,
  };
}
