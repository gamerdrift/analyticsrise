import { DataType, SqlValue } from './types';

export interface ASTNode {
  line?: number;
  colOffset?: number;
}

export type Expression =
  | LiteralExpr
  | ColumnRefExpr
  | StarExpr
  | UnaryOpExpr
  | BinaryOpExpr
  | InExpr
  | BetweenExpr
  | LikeExpr
  | IsNullExpr
  | FunctionCallExpr
  | CaseExpr;

export interface LiteralExpr extends ASTNode {
  type: 'LITERAL';
  value: SqlValue;
  rawType: DataType;
}

export interface ColumnRefExpr extends ASTNode {
  type: 'COLUMN_REF';
  column: string;
  table?: string;
}

export interface StarExpr extends ASTNode {
  type: 'STAR';
  table?: string;
}

export interface UnaryOpExpr extends ASTNode {
  type: 'UNARY_OP';
  operator: 'NOT' | '-' | '+';
  expr: Expression;
}

export interface BinaryOpExpr extends ASTNode {
  type: 'BINARY_OP';
  operator: string; // '=', '!=', '<>', '<', '<=', '>', '>=', '+', '-', '*', '/', '%', 'AND', 'OR', '||'
  left: Expression;
  right: Expression;
}

export interface InExpr extends ASTNode {
  type: 'IN';
  expr: Expression;
  list: Expression[];
  not: boolean;
}

export interface BetweenExpr extends ASTNode {
  type: 'BETWEEN';
  expr: Expression;
  low: Expression;
  high: Expression;
  not: boolean;
}

export interface LikeExpr extends ASTNode {
  type: 'LIKE';
  expr: Expression;
  pattern: Expression;
  not: boolean;
}

export interface IsNullExpr extends ASTNode {
  type: 'IS_NULL';
  expr: Expression;
  not: boolean;
}

export interface FunctionCallExpr extends ASTNode {
  type: 'FUNCTION_CALL';
  name: string;
  args: Expression[];
  isAggregate?: boolean;
  distinct?: boolean;
}

export interface WhenClause {
  when: Expression;
  then: Expression;
}

export interface CaseExpr extends ASTNode {
  type: 'CASE';
  conditions: WhenClause[];
  elseExpr?: Expression;
}

export interface SelectColumn {
  expr: Expression;
  alias?: string;
}

export interface TableReference {
  table: string;
  alias?: string;
}

export type JoinType = 'INNER' | 'LEFT' | 'RIGHT' | 'FULL' | 'CROSS';

export interface JoinClause {
  type: JoinType;
  table: TableReference;
  on?: Expression;
}

export interface OrderByItem {
  expr: Expression;
  direction: 'ASC' | 'DESC';
  nulls?: 'FIRST' | 'LAST';
}

export interface SelectStatement extends ASTNode {
  type: 'SELECT';
  distinct: boolean;
  columns: SelectColumn[];
  from?: TableReference;
  joins: JoinClause[];
  where?: Expression;
  groupBy?: Expression[];
  having?: Expression;
  orderBy?: OrderByItem[];
  limit?: number;
  offset?: number;
}
