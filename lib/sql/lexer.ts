import { SQLError } from './errors';

export type TokenType =
  | 'KEYWORD'
  | 'IDENTIFIER'
  | 'NUMBER'
  | 'STRING'
  | 'OPERATOR'
  | 'PUNCTUATION'
  | 'EOF';

export interface Token {
  type: TokenType;
  value: string;
  line: number;
  column: number;
}

const KEYWORDS = new Set([
  'SELECT',
  'DISTINCT',
  'AS',
  'FROM',
  'WHERE',
  'AND',
  'OR',
  'NOT',
  'IN',
  'BETWEEN',
  'LIKE',
  'IS',
  'NULL',
  'TRUE',
  'FALSE',
  'ORDER',
  'BY',
  'ASC',
  'DESC',
  'LIMIT',
  'OFFSET',
  'GROUP',
  'HAVING',
  'JOIN',
  'INNER',
  'LEFT',
  'RIGHT',
  'FULL',
  'CROSS',
  'OUTER',
  'ON',
  'CASE',
  'WHEN',
  'THEN',
  'ELSE',
  'END',
  'COUNT',
  'SUM',
  'AVG',
  'MIN',
  'MAX',
  'WITH',
  'UNION',
  'ALL',
  // Unsupported DDL / DML keywords to trap cleanly
  'INSERT',
  'UPDATE',
  'DELETE',
  'DROP',
  'ALTER',
  'CREATE',
  'TRUNCATE',
  'REPLACE',
]);

export function tokenize(sql: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  let line = 1;
  let column = 1;

  while (i < sql.length) {
    const char = sql[i];

    // Handle newlines
    if (char === '\n') {
      line++;
      column = 1;
      i++;
      continue;
    }

    // Handle whitespace
    if (/\s/.test(char)) {
      column++;
      i++;
      continue;
    }

    // Handle line comments: -- ...
    if (char === '-' && sql[i + 1] === '-') {
      while (i < sql.length && sql[i] !== '\n') {
        i++;
      }
      continue;
    }

    // Handle block comments: /* ... */
    if (char === '/' && sql[i + 1] === '*') {
      i += 2;
      column += 2;
      while (i < sql.length && !(sql[i] === '*' && sql[i + 1] === '/')) {
        if (sql[i] === '\n') {
          line++;
          column = 1;
        } else {
          column++;
        }
        i++;
      }
      if (i < sql.length) {
        i += 2; // skip */
        column += 2;
      }
      continue;
    }

    const startCol = column;

    // String literals: '...'
    if (char === "'") {
      let strVal = '';
      i++; // skip opening '
      column++;
      while (i < sql.length) {
        if (sql[i] === "'") {
          if (sql[i + 1] === "'") {
            // Escaped quote ''
            strVal += "'";
            i += 2;
            column += 2;
          } else {
            // Closing quote
            i++;
            column++;
            break;
          }
        } else if (sql[i] === '\\' && sql[i + 1] === "'") {
          strVal += "'";
          i += 2;
          column += 2;
        } else if (sql[i] === '\n') {
          strVal += '\n';
          line++;
          column = 1;
          i++;
        } else {
          strVal += sql[i];
          i++;
          column++;
        }
      }
      tokens.push({
        type: 'STRING',
        value: strVal,
        line,
        column: startCol,
      });
      continue;
    }

    // Quoted identifiers: `...` or [...] or "..."
    if (char === '`' || char === '[' || char === '"') {
      const closingChar = char === '[' ? ']' : char;
      let idVal = '';
      i++;
      column++;
      while (i < sql.length && sql[i] !== closingChar) {
        idVal += sql[i];
        i++;
        column++;
      }
      if (i < sql.length) {
        i++; // skip closing
        column++;
      }
      tokens.push({
        type: 'IDENTIFIER',
        value: idVal,
        line,
        column: startCol,
      });
      continue;
    }

    // Numbers: integer or float
    if (/[0-9]/.test(char) || (char === '.' && /[0-9]/.test(sql[i + 1] || ''))) {
      let numStr = '';
      while (i < sql.length && /[0-9.]/.test(sql[i])) {
        numStr += sql[i];
        i++;
        column++;
      }
      tokens.push({
        type: 'NUMBER',
        value: numStr,
        line,
        column: startCol,
      });
      continue;
    }

    // Multi-character operators
    const twoChar = sql.substring(i, i + 2);
    if (['!=', '<>', '<=', '>=', '||'].includes(twoChar)) {
      tokens.push({
        type: 'OPERATOR',
        value: twoChar,
        line,
        column: startCol,
      });
      i += 2;
      column += 2;
      continue;
    }

    // Single-character operators
    if (['=', '<', '>', '+', '-', '*', '/', '%'].includes(char)) {
      tokens.push({
        type: 'OPERATOR',
        value: char,
        line,
        column: startCol,
      });
      i++;
      column++;
      continue;
    }

    // Punctuation
    if (['(', ')', ',', ';', '.'].includes(char)) {
      tokens.push({
        type: 'PUNCTUATION',
        value: char,
        line,
        column: startCol,
      });
      i++;
      column++;
      continue;
    }

    // Word / Identifier / Keyword
    if (/[a-zA-Z_]/.test(char)) {
      let word = '';
      while (i < sql.length && /[a-zA-Z0-9_]/.test(sql[i])) {
        word += sql[i];
        i++;
        column++;
      }

      const upper = word.toUpperCase();
      if (KEYWORDS.has(upper)) {
        tokens.push({
          type: 'KEYWORD',
          value: upper,
          line,
          column: startCol,
        });
      } else {
        tokens.push({
          type: 'IDENTIFIER',
          value: word,
          line,
          column: startCol,
        });
      }
      continue;
    }

    // Unexpected character
    throw new SQLError({
      code: 'SYNTAX_ERROR',
      message: `Unexpected character '${char}' in query.`,
      line,
      column,
      hint: 'Check for unsupported symbols or quotation marks.',
    });
  }

  tokens.push({
    type: 'EOF',
    value: '',
    line,
    column,
  });

  return tokens;
}
