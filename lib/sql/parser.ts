import { Token, tokenize } from './lexer';
import {
  SelectStatement,
  SelectColumn,
  TableReference,
  JoinClause,
  JoinType,
  OrderByItem,
  Expression,
  LiteralExpr,
  ColumnRefExpr,
  StarExpr,
  FunctionCallExpr,
  CaseExpr,
  WhenClause,
} from './ast';
import { SQLError } from './errors';

const AGGREGATE_FUNCTIONS = new Set(['COUNT', 'SUM', 'AVG', 'MIN', 'MAX']);

export class SQLParser {
  private tokens: Token[] = [];
  private pos = 0;

  constructor(sqlOrTokens: string | Token[]) {
    if (typeof sqlOrTokens === 'string') {
      this.tokens = tokenize(sqlOrTokens);
    } else {
      this.tokens = sqlOrTokens;
    }
  }

  private current(): Token {
    return this.tokens[this.pos] || { type: 'EOF', value: '', line: 0, column: 0 };
  }

  private peek(offset = 1): Token {
    return this.tokens[this.pos + offset] || { type: 'EOF', value: '', line: 0, column: 0 };
  }

  private advance(): Token {
    const t = this.current();
    if (this.pos < this.tokens.length - 1) {
      this.pos++;
    }
    return t;
  }

  private matchKeyword(...keywords: string[]): boolean {
    const t = this.current();
    if (t.type === 'KEYWORD' && keywords.includes(t.value.toUpperCase())) {
      this.advance();
      return true;
    }
    return false;
  }

  private matchOperator(...ops: string[]): boolean {
    const t = this.current();
    if (t.type === 'OPERATOR' && ops.includes(t.value)) {
      this.advance();
      return true;
    }
    return false;
  }

  private matchPunctuation(...puncts: string[]): boolean {
    const t = this.current();
    if (t.type === 'PUNCTUATION' && puncts.includes(t.value)) {
      this.advance();
      return true;
    }
    return false;
  }

  private expectKeyword(keyword: string, hint?: string): Token {
    const t = this.current();
    if (t.type === 'KEYWORD' && t.value.toUpperCase() === keyword.toUpperCase()) {
      return this.advance();
    }
    throw new SQLError({
      code: 'SYNTAX_ERROR',
      message: `Expected keyword '${keyword}' but found '${t.value || 'EOF'}'.`,
      line: t.line,
      column: t.column,
      hint: hint || `Ensure query follows standard SQL grammar near '${t.value}'.`,
    });
  }

  private expectPunctuation(punct: string, hint?: string): Token {
    const t = this.current();
    if (t.type === 'PUNCTUATION' && t.value === punct) {
      return this.advance();
    }
    throw new SQLError({
      code: 'SYNTAX_ERROR',
      message: `Expected '${punct}' but found '${t.value || 'EOF'}'.`,
      line: t.line,
      column: t.column,
      hint,
    });
  }

  public parse(): SelectStatement {
    const first = this.current();

    // Trap unsupported DDL/DML
    if (['INSERT', 'UPDATE', 'DELETE', 'DROP', 'ALTER', 'CREATE', 'TRUNCATE'].includes(first.value.toUpperCase())) {
      throw new SQLError({
        code: 'UNSUPPORTED_FEATURE',
        message: `This SQL operation ('${first.value.toUpperCase()}') is not supported in AnalyticsRise SQL Studio.`,
        line: first.line,
        column: first.column,
        hint: 'AnalyticsRise SQL Studio is an analytics and query practice environment focused on SELECT queries.',
      });
    }

    if (first.type === 'KEYWORD' && first.value === 'SELECT') {
      return this.parseSelect();
    }

    throw new SQLError({
      code: 'SYNTAX_ERROR',
      message: `Query must begin with 'SELECT', found '${first.value}'.`,
      line: first.line,
      column: first.column,
      hint: 'AnalyticsRise SQL Studio evaluates analytical SELECT queries.',
    });
  }

  private parseSelect(): SelectStatement {
    const selectToken = this.expectKeyword('SELECT');
    const distinct = this.matchKeyword('DISTINCT');

    // Parse Columns
    const columns = this.parseSelectColumns();

    // Parse FROM
    let from: TableReference | undefined;
    if (this.matchKeyword('FROM')) {
      from = this.parseTableReference();
    }

    // Parse JOINs
    const joins: JoinClause[] = [];
    while (
      this.current().type === 'KEYWORD' &&
      ['JOIN', 'INNER', 'LEFT', 'RIGHT', 'FULL', 'CROSS'].includes(this.current().value)
    ) {
      joins.push(this.parseJoin());
    }

    // Parse WHERE
    let where: Expression | undefined;
    if (this.matchKeyword('WHERE')) {
      where = this.parseExpression();
    }

    // Parse GROUP BY
    let groupBy: Expression[] | undefined;
    if (this.matchKeyword('GROUP')) {
      this.expectKeyword('BY', "Use 'GROUP BY <columns>' for aggregation grouping.");
      groupBy = [this.parseExpression()];
      while (this.matchPunctuation(',')) {
        groupBy.push(this.parseExpression());
      }
    }

    // Parse HAVING
    let having: Expression | undefined;
    if (this.matchKeyword('HAVING')) {
      having = this.parseExpression();
    }

    // Parse ORDER BY
    let orderBy: OrderByItem[] | undefined;
    if (this.matchKeyword('ORDER')) {
      this.expectKeyword('BY', "Use 'ORDER BY <column> [ASC|DESC]'.");
      orderBy = [this.parseOrderByItem()];
      while (this.matchPunctuation(',')) {
        orderBy.push(this.parseOrderByItem());
      }
    }

    // Parse LIMIT / OFFSET
    let limit: number | undefined;
    let offset: number | undefined;

    if (this.matchKeyword('LIMIT')) {
      const numToken = this.advance();
      if (numToken.type !== 'NUMBER') {
        throw new SQLError({
          code: 'INVALID_LIMIT',
          message: `LIMIT requires a positive numeric integer, found '${numToken.value}'.`,
          line: numToken.line,
          column: numToken.column,
          hint: 'Example: LIMIT 10 OFFSET 20',
        });
      }
      limit = parseInt(numToken.value, 10);

      if (this.matchKeyword('OFFSET')) {
        const offsetToken = this.advance();
        if (offsetToken.type !== 'NUMBER') {
          throw new SQLError({
            code: 'INVALID_LIMIT',
            message: `OFFSET requires a numeric integer, found '${offsetToken.value}'.`,
            line: offsetToken.line,
            column: offsetToken.column,
          });
        }
        offset = parseInt(offsetToken.value, 10);
      }
    } else if (this.matchKeyword('OFFSET')) {
      const offsetToken = this.advance();
      if (offsetToken.type !== 'NUMBER') {
        throw new SQLError({
          code: 'INVALID_LIMIT',
          message: `OFFSET requires a numeric integer, found '${offsetToken.value}'.`,
          line: offsetToken.line,
          column: offsetToken.column,
        });
      }
      offset = parseInt(offsetToken.value, 10);
    }

    // Optional trailing semicolon
    this.matchPunctuation(';');

    return {
      type: 'SELECT',
      line: selectToken.line,
      colOffset: selectToken.column,
      distinct,
      columns,
      from,
      joins,
      where,
      groupBy,
      having,
      orderBy,
      limit,
      offset,
    };
  }

  private parseSelectColumns(): SelectColumn[] {
    const columns: SelectColumn[] = [];

    do {
      if (this.current().type === 'OPERATOR' && this.current().value === '*') {
        const t = this.advance();
        columns.push({
          expr: { type: 'STAR', line: t.line, colOffset: t.column },
        });
      } else {
        const expr = this.parseExpression();
        let alias: string | undefined;

        if (this.matchKeyword('AS')) {
          const aliasToken = this.advance();
          if (aliasToken.type !== 'IDENTIFIER' && aliasToken.type !== 'STRING') {
            throw new SQLError({
              code: 'SYNTAX_ERROR',
              message: `Expected column alias identifier after AS, found '${aliasToken.value}'.`,
              line: aliasToken.line,
              column: aliasToken.column,
            });
          }
          alias = aliasToken.value;
        } else if (
          this.current().type === 'IDENTIFIER' &&
          !['FROM', 'WHERE', 'GROUP', 'HAVING', 'ORDER', 'LIMIT', 'JOIN', 'INNER', 'LEFT', 'RIGHT', 'FULL', 'CROSS', 'UNION'].includes(
            this.current().value.toUpperCase()
          )
        ) {
          // Implicit alias without AS keyword
          alias = this.advance().value;
        }

        columns.push({ expr, alias });
      }
    } while (this.matchPunctuation(','));

    return columns;
  }

  private parseTableReference(): TableReference {
    const tableToken = this.advance();
    if (tableToken.type !== 'IDENTIFIER') {
      throw new SQLError({
        code: 'SYNTAX_ERROR',
        message: `Expected table name after FROM, found '${tableToken.value}'.`,
        line: tableToken.line,
        column: tableToken.column,
        hint: 'Specify a valid table in the current schema (e.g. FROM customers).',
      });
    }

    let alias: string | undefined;
    if (this.matchKeyword('AS')) {
      const aliasToken = this.advance();
      if (aliasToken.type !== 'IDENTIFIER') {
        throw new SQLError({
          code: 'SYNTAX_ERROR',
          message: `Expected table alias identifier, found '${aliasToken.value}'.`,
          line: aliasToken.line,
          column: aliasToken.column,
        });
      }
      alias = aliasToken.value;
    } else if (
      this.current().type === 'IDENTIFIER' &&
      !['WHERE', 'JOIN', 'INNER', 'LEFT', 'RIGHT', 'FULL', 'CROSS', 'GROUP', 'HAVING', 'ORDER', 'LIMIT', 'ON'].includes(
        this.current().value.toUpperCase()
      )
    ) {
      alias = this.advance().value;
    }

    return { table: tableToken.value, alias };
  }

  private parseJoin(): JoinClause {
    let joinType: JoinType = 'INNER';

    if (this.matchKeyword('LEFT')) {
      this.matchKeyword('OUTER');
      this.expectKeyword('JOIN');
      joinType = 'LEFT';
    } else if (this.matchKeyword('RIGHT')) {
      this.matchKeyword('OUTER');
      this.expectKeyword('JOIN');
      joinType = 'RIGHT';
    } else if (this.matchKeyword('FULL')) {
      this.matchKeyword('OUTER');
      this.expectKeyword('JOIN');
      joinType = 'FULL';
    } else if (this.matchKeyword('CROSS')) {
      this.expectKeyword('JOIN');
      joinType = 'CROSS';
    } else if (this.matchKeyword('INNER')) {
      this.expectKeyword('JOIN');
      joinType = 'INNER';
    } else {
      this.expectKeyword('JOIN');
      joinType = 'INNER';
    }

    const table = this.parseTableReference();
    let on: Expression | undefined;

    if (joinType !== 'CROSS') {
      this.expectKeyword('ON', `Specify the join condition using ON (e.g. ON c.id = o.customer_id).`);
      on = this.parseExpression();
    }

    return { type: joinType, table, on };
  }

  private parseOrderByItem(): OrderByItem {
    const expr = this.parseExpression();
    let direction: 'ASC' | 'DESC' = 'ASC';

    if (this.matchKeyword('DESC')) {
      direction = 'DESC';
    } else if (this.matchKeyword('ASC')) {
      direction = 'ASC';
    }

    let nulls: 'FIRST' | 'LAST' | undefined;
    if (this.matchKeyword('NULLS')) {
      if (this.matchKeyword('FIRST')) {
        nulls = 'FIRST';
      } else if (this.matchKeyword('LAST')) {
        nulls = 'LAST';
      }
    }

    return { expr, direction, nulls };
  }

  // ==========================================
  // EXPRESSION PARSER (Operator Precedence)
  // ==========================================

  public parseExpression(): Expression {
    return this.parseOr();
  }

  private parseOr(): Expression {
    let left = this.parseAnd();

    while (this.matchKeyword('OR')) {
      const right = this.parseAnd();
      left = {
        type: 'BINARY_OP',
        operator: 'OR',
        left,
        right,
      };
    }

    return left;
  }

  private parseAnd(): Expression {
    let left = this.parseNot();

    while (this.matchKeyword('AND')) {
      const right = this.parseNot();
      left = {
        type: 'BINARY_OP',
        operator: 'AND',
        left,
        right,
      };
    }

    return left;
  }

  private parseNot(): Expression {
    if (this.matchKeyword('NOT')) {
      const expr = this.parseComparison();
      return {
        type: 'UNARY_OP',
        operator: 'NOT',
        expr,
      };
    }
    return this.parseComparison();
  }

  private parseComparison(): Expression {
    const left = this.parseAddition();

    // Check IS [NOT] NULL
    if (this.matchKeyword('IS')) {
      const not = this.matchKeyword('NOT');
      this.expectKeyword('NULL', "Use 'IS NULL' or 'IS NOT NULL' to check for missing values.");
      return {
        type: 'IS_NULL',
        expr: left,
        not,
      };
    }

    // Check [NOT] LIKE
    let notLike = false;
    if (this.matchKeyword('NOT')) {
      if (this.matchKeyword('LIKE')) {
        notLike = true;
      } else {
        this.pos--;
      }
    }

    if (notLike || this.matchKeyword('LIKE')) {
      const pattern = this.parseAddition();
      return {
        type: 'LIKE',
        expr: left,
        pattern,
        not: notLike,
      };
    }

    // Check [NOT] BETWEEN
    let notBetween = false;
    if (this.matchKeyword('NOT')) {
      if (this.matchKeyword('BETWEEN')) {
        notBetween = true;
      } else {
        this.pos--;
      }
    }

    if (notBetween || this.matchKeyword('BETWEEN')) {
      const low = this.parseAddition();
      this.expectKeyword('AND', "BETWEEN clause requires 'BETWEEN <low> AND <high>'.");
      const high = this.parseAddition();
      return {
        type: 'BETWEEN',
        expr: left,
        low,
        high,
        not: notBetween,
      };
    }

    // Check [NOT] IN (...)
    let notIn = false;
    if (this.matchKeyword('NOT')) {
      if (this.matchKeyword('IN')) {
        notIn = true;
      } else {
        this.pos--;
      }
    }

    if (notIn || this.matchKeyword('IN')) {
      this.expectPunctuation('(', "IN expression requires parenthesized items, e.g. IN ('SMB', 'Enterprise')");
      const list: Expression[] = [];
      if (!this.matchPunctuation(')')) {
        do {
          list.push(this.parseExpression());
        } while (this.matchPunctuation(','));
        this.expectPunctuation(')');
      }
      return {
        type: 'IN',
        expr: left,
        list,
        not: notIn,
      };
    }

    // Standard Comparison Operators: =, !=, <>, <, <=, >, >=
    if (this.current().type === 'OPERATOR' && ['=', '!=', '<>', '<', '<=', '>', '>='].includes(this.current().value)) {
      const opToken = this.advance();
      const right = this.parseAddition();
      return {
        type: 'BINARY_OP',
        operator: opToken.value,
        left,
        right,
        line: opToken.line,
        colOffset: opToken.column,
      };
    }

    return left;
  }

  private parseAddition(): Expression {
    let left = this.parseMultiplication();

    while (
      (this.current().type === 'OPERATOR' && ['+', '-', '||'].includes(this.current().value))
    ) {
      const opToken = this.advance();
      const right = this.parseMultiplication();
      left = {
        type: 'BINARY_OP',
        operator: opToken.value,
        left,
        right,
        line: opToken.line,
        colOffset: opToken.column,
      };
    }

    return left;
  }

  private parseMultiplication(): Expression {
    let left = this.parseUnary();

    while (
      this.current().type === 'OPERATOR' &&
      ['*', '/', '%'].includes(this.current().value)
    ) {
      const opToken = this.advance();
      const right = this.parseUnary();
      left = {
        type: 'BINARY_OP',
        operator: opToken.value,
        left,
        right,
        line: opToken.line,
        colOffset: opToken.column,
      };
    }

    return left;
  }

  private parseUnary(): Expression {
    if (this.current().type === 'OPERATOR' && ['+', '-'].includes(this.current().value)) {
      const opToken = this.advance();
      const expr = this.parseUnary();
      return {
        type: 'UNARY_OP',
        operator: opToken.value as '+' | '-',
        expr,
        line: opToken.line,
        colOffset: opToken.column,
      };
    }

    return this.parsePrimary();
  }

  private parsePrimary(): Expression {
    const t = this.current();

    // Literal Numbers
    if (t.type === 'NUMBER') {
      this.advance();
      const isFloat = t.value.includes('.');
      return {
        type: 'LITERAL',
        value: isFloat ? parseFloat(t.value) : parseInt(t.value, 10),
        rawType: isFloat ? 'DECIMAL' : 'INTEGER',
        line: t.line,
        colOffset: t.column,
      };
    }

    // Literal Strings
    if (t.type === 'STRING') {
      this.advance();
      return {
        type: 'LITERAL',
        value: t.value,
        rawType: 'TEXT',
        line: t.line,
        colOffset: t.column,
      };
    }

    // Literal NULL / TRUE / FALSE
    if (t.type === 'KEYWORD') {
      if (t.value === 'NULL') {
        this.advance();
        return { type: 'LITERAL', value: null, rawType: 'NULL', line: t.line, colOffset: t.column };
      }
      if (t.value === 'TRUE') {
        this.advance();
        return { type: 'LITERAL', value: true, rawType: 'BOOLEAN', line: t.line, colOffset: t.column };
      }
      if (t.value === 'FALSE') {
        this.advance();
        return { type: 'LITERAL', value: false, rawType: 'BOOLEAN', line: t.line, colOffset: t.column };
      }

      // CASE WHEN ... THEN ... ELSE ... END
      if (t.value === 'CASE') {
        return this.parseCase();
      }

      // Aggregate Functions (COUNT, SUM, AVG, MIN, MAX)
      if (AGGREGATE_FUNCTIONS.has(t.value)) {
        const fnToken = this.advance();
        return this.parseFunctionCall(fnToken.value, true);
      }
    }

    // Identifiers (Column references or function calls or table.column)
    if (t.type === 'IDENTIFIER') {
      const name = this.advance().value;

      // Check if function call: name(...)
      if (this.current().type === 'PUNCTUATION' && this.current().value === '(') {
        return this.parseFunctionCall(name, AGGREGATE_FUNCTIONS.has(name.toUpperCase()));
      }

      // Check table.column: table.col or table.*
      if (this.matchPunctuation('.')) {
        const next = this.current();
        if (next.type === 'OPERATOR' && next.value === '*') {
          this.advance();
          return {
            type: 'STAR',
            table: name,
            line: t.line,
            colOffset: t.column,
          };
        }
        if (next.type === 'IDENTIFIER') {
          const colName = this.advance().value;
          return {
            type: 'COLUMN_REF',
            table: name,
            column: colName,
            line: t.line,
            colOffset: t.column,
          };
        }
      }

      return {
        type: 'COLUMN_REF',
        column: name,
        line: t.line,
        colOffset: t.column,
      };
    }

    // Parenthesized expression: (expr)
    if (t.type === 'PUNCTUATION' && t.value === '(') {
      this.advance();
      const expr = this.parseExpression();
      this.expectPunctuation(')');
      return expr;
    }

    throw new SQLError({
      code: 'SYNTAX_ERROR',
      message: `Unexpected token '${t.value || 'EOF'}' in expression.`,
      line: t.line,
      column: t.column,
      hint: 'Check for missing parentheses, quotes, or commas.',
    });
  }

  private parseFunctionCall(name: string, isAggregate: boolean): FunctionCallExpr {
    const fnToken = this.tokens[this.pos - 1] || this.current();
    this.expectPunctuation('(');

    let distinct = false;
    if (isAggregate && this.matchKeyword('DISTINCT')) {
      distinct = true;
    }

    const args: Expression[] = [];

    if (!this.matchPunctuation(')')) {
      if (this.current().type === 'OPERATOR' && this.current().value === '*') {
        const starToken = this.advance();
        args.push({ type: 'STAR', line: starToken.line, colOffset: starToken.column });
      } else {
        do {
          args.push(this.parseExpression());
        } while (this.matchPunctuation(','));
      }
      this.expectPunctuation(')');
    }

    return {
      type: 'FUNCTION_CALL',
      name: name.toUpperCase(),
      args,
      isAggregate,
      distinct,
      line: fnToken.line,
      colOffset: fnToken.column,
    };
  }

  private parseCase(): CaseExpr {
    const caseToken = this.expectKeyword('CASE');
    const conditions: WhenClause[] = [];

    while (this.matchKeyword('WHEN')) {
      const when = this.parseExpression();
      this.expectKeyword('THEN', "CASE statement requires 'WHEN <condition> THEN <result>'.");
      const then = this.parseExpression();
      conditions.push({ when, then });
    }

    if (conditions.length === 0) {
      throw new SQLError({
        code: 'SYNTAX_ERROR',
        message: "CASE statement requires at least one 'WHEN ... THEN ...' clause.",
        line: caseToken.line,
        column: caseToken.column,
      });
    }

    let elseExpr: Expression | undefined;
    if (this.matchKeyword('ELSE')) {
      elseExpr = this.parseExpression();
    }

    this.expectKeyword('END', "CASE statement must be closed with 'END'.");

    return {
      type: 'CASE',
      conditions,
      elseExpr,
      line: caseToken.line,
      colOffset: caseToken.column,
    };
  }
}

export function parseSql(sql: string): SelectStatement {
  const parser = new SQLParser(sql);
  return parser.parse();
}
