import { Expression } from './ast';
import { SqlValue, Row } from './types';
import { SQLError } from './errors';

export interface EvaluationScope {
  row: Row;
  tableAliases?: Record<string, string>; // alias -> real table name
}

/**
 * Converts SQL LIKE pattern (with % and _) into JavaScript RegExp
 */
export function likeToRegExp(pattern: string): RegExp {
  const escaped = pattern
    .replace(/[.+^${}()|[\]\\]/g, '\\$&') // escape regex special chars except % and _
    .replace(/%/g, '.*')
    .replace(/_/g, '.');
  return new RegExp(`^${escaped}$`, 'i');
}

/**
 * Strict SQL Comparison:
 * If either operand is NULL, the result is NULL (falsy in boolean contexts).
 */
export function compareSqlValues(a: SqlValue, b: SqlValue, operator: string): boolean | null {
  if (a === null || a === undefined || b === null || b === undefined) {
    return null;
  }

  // Type-aware comparison
  if (typeof a === 'number' && typeof b === 'number') {
    switch (operator) {
      case '=':
        return a === b;
      case '!=':
      case '<>':
        return a !== b;
      case '<':
        return a < b;
      case '<=':
        return a <= b;
      case '>':
        return a > b;
      case '>=':
        return a >= b;
      default:
        return null;
    }
  }

  // Date / String comparison
  const strA = String(a);
  const strB = String(b);

  switch (operator) {
    case '=':
      return strA.toLowerCase() === strB.toLowerCase();
    case '!=':
    case '<>':
      return strA.toLowerCase() !== strB.toLowerCase();
    case '<':
      return strA < strB;
    case '<=':
      return strA <= strB;
    case '>':
      return strA > strB;
    case '>=':
      return strA >= strB;
    default:
      return null;
  }
}

/**
 * Executes a built-in SQL scalar function given evaluated arguments
 */
export function executeScalarFunction(
  name: string,
  evaluatedArgs: SqlValue[],
  line?: number,
  colOffset?: number
): SqlValue {
  const fnName = name.toUpperCase();

  // String Functions
  if (fnName === 'LOWER') {
    const val = evaluatedArgs[0];
    return val === null || val === undefined ? null : String(val).toLowerCase();
  }
  if (fnName === 'UPPER') {
    const val = evaluatedArgs[0];
    return val === null || val === undefined ? null : String(val).toUpperCase();
  }
  if (fnName === 'CONCAT') {
    return evaluatedArgs.map((a) => (a === null || a === undefined ? '' : String(a))).join('');
  }
  if (fnName === 'LENGTH' || fnName === 'LEN') {
    const val = evaluatedArgs[0];
    return val === null || val === undefined ? null : String(val).length;
  }
  if (fnName === 'TRIM') {
    const val = evaluatedArgs[0];
    return val === null || val === undefined ? null : String(val).trim();
  }
  if (fnName === 'LTRIM') {
    const val = evaluatedArgs[0];
    return val === null || val === undefined ? null : String(val).trimStart();
  }
  if (fnName === 'RTRIM') {
    const val = evaluatedArgs[0];
    return val === null || val === undefined ? null : String(val).trimEnd();
  }
  if (fnName === 'SUBSTRING' || fnName === 'SUBSTR') {
    const str = evaluatedArgs[0];
    if (str === null || str === undefined) return null;
    const start = Number(evaluatedArgs[1] ?? 1) - 1; // 1-indexed in SQL
    const len = evaluatedArgs[2] !== undefined ? Number(evaluatedArgs[2]) : undefined;
    return String(str).substring(start, len !== undefined ? start + len : undefined);
  }

  // Date Functions
  if (fnName === 'DATE') {
    const val = evaluatedArgs[0];
    if (val === null || val === undefined) return null;
    const d = new Date(String(val));
    return isNaN(d.getTime()) ? null : d.toISOString().split('T')[0];
  }
  if (fnName === 'YEAR') {
    const val = evaluatedArgs[0];
    if (val === null || val === undefined) return null;
    const d = new Date(String(val));
    return isNaN(d.getTime()) ? null : d.getUTCFullYear();
  }
  if (fnName === 'MONTH') {
    const val = evaluatedArgs[0];
    if (val === null || val === undefined) return null;
    const d = new Date(String(val));
    return isNaN(d.getTime()) ? null : d.getUTCMonth() + 1;
  }
  if (fnName === 'DAY') {
    const val = evaluatedArgs[0];
    if (val === null || val === undefined) return null;
    const d = new Date(String(val));
    return isNaN(d.getTime()) ? null : d.getUTCDate();
  }

  // Math & General Functions
  if (fnName === 'ROUND') {
    const num = evaluatedArgs[0];
    if (num === null || num === undefined) return null;
    const decimals = Number(evaluatedArgs[1] ?? 0);
    const factor = Math.pow(10, decimals);
    return Math.round(Number(num) * factor) / factor;
  }
  if (fnName === 'ABS') {
    const num = evaluatedArgs[0];
    return num === null || num === undefined ? null : Math.abs(Number(num));
  }
  if (fnName === 'CEIL' || fnName === 'CEILING') {
    const num = evaluatedArgs[0];
    return num === null || num === undefined ? null : Math.ceil(Number(num));
  }
  if (fnName === 'FLOOR') {
    const num = evaluatedArgs[0];
    return num === null || num === undefined ? null : Math.floor(Number(num));
  }
  if (fnName === 'COALESCE') {
    for (const arg of evaluatedArgs) {
      if (arg !== null && arg !== undefined) return arg;
    }
    return null;
  }
  if (fnName === 'NULLIF') {
    const a = evaluatedArgs[0];
    const b = evaluatedArgs[1];
    return compareSqlValues(a, b, '=') === true ? null : a;
  }
  if (fnName === 'IFNULL') {
    return evaluatedArgs[0] ?? evaluatedArgs[1] ?? null;
  }

  throw new SQLError({
    code: 'INVALID_FUNCTION',
    message: `Function '${name}' is not recognized or unsupported.`,
    line,
    column: colOffset,
    hint: 'Supported scalar functions include: LOWER, UPPER, CONCAT, LENGTH, TRIM, SUBSTRING, DATE, YEAR, MONTH, DAY, ROUND, ABS, COALESCE.',
  });
}

/**
 * Evaluates an AST expression against an active evaluation scope/row
 */
export function evaluateExpression(expr: Expression, scope: EvaluationScope): SqlValue {
  switch (expr.type) {
    case 'LITERAL':
      return expr.value;

    case 'COLUMN_REF': {
      const colName = expr.column.toLowerCase();

      // Check fully-qualified column name (table.column or alias.column)
      if (expr.table) {
        const tbl = expr.table.toLowerCase();
        const qualifiedKey = `${tbl}.${colName}`;
        if (qualifiedKey in scope.row) {
          return scope.row[qualifiedKey];
        }
      }

      // Check unqualified column name
      if (colName in scope.row) {
        return scope.row[colName];
      }

      // Check if row has any prefixed key matching .colName
      const matchingKeys = Object.keys(scope.row).filter(
        (k) => k.toLowerCase() === colName || k.toLowerCase().endsWith(`.${colName}`)
      );

      if (matchingKeys.length === 1) {
        return scope.row[matchingKeys[0]];
      }

      if (matchingKeys.length > 1) {
        throw new SQLError({
          code: 'AMBIGUOUS_COLUMN',
          message: `Column reference '${expr.column}' is ambiguous across joined tables.`,
          line: expr.line,
          column: expr.colOffset,
          hint: `Disambiguate by specifying the table or alias name (e.g. customers.${expr.column}).`,
        });
      }

      throw new SQLError({
        code: 'COLUMN_NOT_FOUND',
        message: `Column '${expr.table ? `${expr.table}.${expr.column}` : expr.column}' does not exist in active query scope.`,
        line: expr.line,
        column: expr.colOffset,
        hint: 'Check table schema for correct column spelling.',
      });
    }

    case 'STAR':
      throw new SQLError({
        code: 'RUNTIME_ERROR',
        message: 'Cannot evaluate STAR (*) expression as a scalar value.',
      });

    case 'UNARY_OP': {
      const val = evaluateExpression(expr.expr, scope);
      if (expr.operator === 'NOT') {
        if (val === null || val === undefined) return null;
        return !val;
      }
      if (expr.operator === '-') {
        if (typeof val === 'number') return -val;
        if (val === null) return null;
        const num = parseFloat(String(val));
        return isNaN(num) ? null : -num;
      }
      if (expr.operator === '+') {
        if (typeof val === 'number') return val;
        if (val === null) return null;
        const num = parseFloat(String(val));
        return isNaN(num) ? null : num;
      }
      return null;
    }

    case 'BINARY_OP': {
      const op = expr.operator.toUpperCase();

      // Logical short-circuiting: AND / OR
      if (op === 'AND') {
        const leftVal = evaluateExpression(expr.left, scope);
        if (leftVal === false) return false;
        const rightVal = evaluateExpression(expr.right, scope);
        if (rightVal === false) return false;
        if (leftVal === null || rightVal === null) return null;
        return Boolean(leftVal && rightVal);
      }

      if (op === 'OR') {
        const leftVal = evaluateExpression(expr.left, scope);
        if (leftVal === true) return true;
        const rightVal = evaluateExpression(expr.right, scope);
        if (rightVal === true) return true;
        if (leftVal === null && rightVal === null) return null;
        return Boolean(leftVal || rightVal);
      }

      // String Concatenation ||
      if (op === '||') {
        const leftVal = evaluateExpression(expr.left, scope);
        const rightVal = evaluateExpression(expr.right, scope);
        if (leftVal === null && rightVal === null) return null;
        return `${leftVal ?? ''}${rightVal ?? ''}`;
      }

      const left = evaluateExpression(expr.left, scope);
      const right = evaluateExpression(expr.right, scope);

      // Comparisons
      if (['=', '!=', '<>', '<', '<=', '>', '>='].includes(op)) {
        return compareSqlValues(left, right, op);
      }

      // Arithmetic
      if (left === null || right === null || left === undefined || right === undefined) {
        return null;
      }

      const numA = typeof left === 'number' ? left : parseFloat(String(left));
      const numB = typeof right === 'number' ? right : parseFloat(String(right));

      if (isNaN(numA) || isNaN(numB)) {
        return null;
      }

      switch (op) {
        case '+':
          return numA + numB;
        case '-':
          return numA - numB;
        case '*':
          return numA * numB;
        case '/':
          return numB === 0 ? null : numA / numB;
        case '%':
          return numB === 0 ? null : numA % numB;
        default:
          return null;
      }
    }

    case 'IS_NULL': {
      const val = evaluateExpression(expr.expr, scope);
      const isNull = val === null || val === undefined;
      return expr.not ? !isNull : isNull;
    }

    case 'LIKE': {
      const val = evaluateExpression(expr.expr, scope);
      const pattern = evaluateExpression(expr.pattern, scope);
      if (val === null || pattern === null) return null;

      const regex = likeToRegExp(String(pattern));
      const matches = regex.test(String(val));
      return expr.not ? !matches : matches;
    }

    case 'BETWEEN': {
      const val = evaluateExpression(expr.expr, scope);
      const low = evaluateExpression(expr.low, scope);
      const high = evaluateExpression(expr.high, scope);

      if (val === null || low === null || high === null) return null;

      const isBetween =
        compareSqlValues(val, low, '>=') === true && compareSqlValues(val, high, '<=') === true;

      return expr.not ? !isBetween : isBetween;
    }

    case 'IN': {
      const val = evaluateExpression(expr.expr, scope);
      if (val === null) return null;

      let found = false;
      let hasNull = false;

      for (const itemExpr of expr.list) {
        const itemVal = evaluateExpression(itemExpr, scope);
        if (itemVal === null) {
          hasNull = true;
          continue;
        }
        if (compareSqlValues(val, itemVal, '=') === true) {
          found = true;
          break;
        }
      }

      if (found) return expr.not ? false : true;
      if (hasNull) return null; // SQL standard IN behavior with NULL
      return expr.not ? true : false;
    }

    case 'CASE': {
      for (const clause of expr.conditions) {
        const condResult = evaluateExpression(clause.when, scope);
        if (condResult === true) {
          return evaluateExpression(clause.then, scope);
        }
      }
      if (expr.elseExpr) {
        return evaluateExpression(expr.elseExpr, scope);
      }
      return null;
    }

    case 'FUNCTION_CALL': {
      const fnName = expr.name.toUpperCase();

      // Aggregate functions are handled during group aggregation phase;
      // if evaluated directly on a single row, evaluate their argument
      if (['COUNT', 'SUM', 'AVG', 'MIN', 'MAX'].includes(fnName)) {
        if (expr.args.length === 0 || expr.args[0].type === 'STAR') {
          return 1;
        }
        return evaluateExpression(expr.args[0], scope);
      }

      const evaluatedArgs = expr.args.map((a) => evaluateExpression(a, scope));
      return executeScalarFunction(expr.name, evaluatedArgs, expr.line, expr.colOffset);
    }

    default:
      return null;
  }
}
