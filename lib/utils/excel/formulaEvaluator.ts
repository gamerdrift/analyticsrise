export type CellAddressKey = string; // e.g. "0,1" -> row 0, col 1

export interface EvaluatedCellData {
  value: string | number | boolean | null;
  formula?: string;
  error?: string;
}

export interface FormulaAutocompleteItem {
  name: string;
  category: 'Math' | 'Logical' | 'Lookup' | 'Text' | 'Date' | 'Statistical';
  syntax: string;
  description: string;
  example: string;
}

export const FORMULA_CATALOG: FormulaAutocompleteItem[] = [
  // Mathematical
  { name: 'SUM', category: 'Math', syntax: 'SUM(range)', description: 'Adds all numbers in a range of cells.', example: '=SUM(A1:A10)' },
  { name: 'AVERAGE', category: 'Math', syntax: 'AVERAGE(range)', description: 'Calculates the average of numbers in a range.', example: '=AVERAGE(B1:B20)' },
  { name: 'MIN', category: 'Math', syntax: 'MIN(range)', description: 'Returns the smallest number in a range.', example: '=MIN(C1:C15)' },
  { name: 'MAX', category: 'Math', syntax: 'MAX(range)', description: 'Returns the largest number in a range.', example: '=MAX(C1:C15)' },
  { name: 'ROUND', category: 'Math', syntax: 'ROUND(number, num_digits)', description: 'Rounds a number to a specified number of digits.', example: '=ROUND(A1, 2)' },
  { name: 'ABS', category: 'Math', syntax: 'ABS(number)', description: 'Returns the absolute value of a number.', example: '=ABS(-42)' },
  { name: 'POWER', category: 'Math', syntax: 'POWER(number, power)', description: 'Returns the result of a number raised to a power.', example: '=POWER(A1, 2)' },
  
  // Logical
  { name: 'IF', category: 'Logical', syntax: 'IF(logical_test, value_if_true, [value_if_false])', description: 'Checks whether a condition is met, returning one value if True and another if False.', example: '=IF(A1>50, "Pass", "Fail")' },
  { name: 'IFS', category: 'Logical', syntax: 'IFS(condition1, value1, [condition2, value2], ...)', description: 'Evaluates multiple conditions and returns the value corresponding to the first True condition.', example: '=IFS(A1>=90, "A", A1>=80, "B", A1<80, "C")' },
  { name: 'AND', category: 'Logical', syntax: 'AND(logical1, [logical2], ...)', description: 'Returns TRUE if all arguments are TRUE.', example: '=AND(A1>0, B1>0)' },
  { name: 'OR', category: 'Logical', syntax: 'OR(logical1, [logical2], ...)', description: 'Returns TRUE if any argument is TRUE.', example: '=OR(A1="Yes", B1="Yes")' },
  { name: 'NOT', category: 'Logical', syntax: 'NOT(logical)', description: 'Reverses the logical value of its argument.', example: '=NOT(A1>100)' },

  // Lookup
  { name: 'XLOOKUP', category: 'Lookup', syntax: 'XLOOKUP(lookup_value, lookup_array, return_array, [if_not_found])', description: 'Searches a range or array for a match and returns the corresponding item from a second range.', example: '=XLOOKUP(A1, B1:B10, C1:C10, "Not Found")' },
  { name: 'VLOOKUP', category: 'Lookup', syntax: 'VLOOKUP(lookup_value, table_array, col_index_num, [range_lookup])', description: 'Looks for a value in the first column of a table and returns a value in the same row from a specified column.', example: '=VLOOKUP(A1, A1:D100, 3, FALSE)' },
  { name: 'HLOOKUP', category: 'Lookup', syntax: 'HLOOKUP(lookup_value, table_array, row_index_num, [range_lookup])', description: 'Looks for a value in the top row of a table and returns a value in the same column from a specified row.', example: '=HLOOKUP("Sales", A1:Z10, 2, FALSE)' },
  { name: 'INDEX', category: 'Lookup', syntax: 'INDEX(array, row_num, [col_num])', description: 'Returns a value or reference to a value from within a table or range.', example: '=INDEX(A1:C10, 2, 3)' },
  { name: 'MATCH', category: 'Lookup', syntax: 'MATCH(lookup_value, lookup_array, [match_type])', description: 'Returns the relative position of an item in an array that matches a specified value.', example: '=MATCH("Target", A1:A50, 0)' },

  // Text
  { name: 'LEFT', category: 'Text', syntax: 'LEFT(text, [num_chars])', description: 'Returns the specified number of characters from the start of a text string.', example: '=LEFT(A1, 3)' },
  { name: 'RIGHT', category: 'Text', syntax: 'RIGHT(text, [num_chars])', description: 'Returns the specified number of characters from the end of a text string.', example: '=RIGHT(A1, 4)' },
  { name: 'MID', category: 'Text', syntax: 'MID(text, start_num, num_chars)', description: 'Returns characters from the middle of a text string given a starting position and length.', example: '=MID(A1, 2, 5)' },
  { name: 'LEN', category: 'Text', syntax: 'LEN(text)', description: 'Returns the number of characters in a text string.', example: '=LEN(A1)' },
  { name: 'CONCAT', category: 'Text', syntax: 'CONCAT(text1, [text2], ...)', description: 'Combines the text from multiple ranges and/or strings.', example: '=CONCAT(A1, " ", B1)' },
  { name: 'TEXTJOIN', category: 'Text', syntax: 'TEXTJOIN(delimiter, ignore_empty, text1, [text2], ...)', description: 'Combines text from multiple ranges with a specified delimiter.', example: '=TEXTJOIN(", ", TRUE, A1:A5)' },

  // Date & Time
  { name: 'TODAY', category: 'Date', syntax: 'TODAY()', description: 'Returns the current date formatted as YYYY-MM-DD.', example: '=TODAY()' },
  { name: 'NOW', category: 'Date', syntax: 'NOW()', description: 'Returns the current date and time.', example: '=NOW()' },
  { name: 'YEAR', category: 'Date', syntax: 'YEAR(date)', description: 'Returns the year of a date as a 4-digit integer.', example: '=YEAR(A1)' },
  { name: 'MONTH', category: 'Date', syntax: 'MONTH(date)', description: 'Returns the month of a date (1 to 12).', example: '=MONTH(A1)' },
  { name: 'DAY', category: 'Date', syntax: 'DAY(date)', description: 'Returns the day of the month (1 to 31).', example: '=DAY(A1)' },
  { name: 'NETWORKDAYS', category: 'Date', syntax: 'NETWORKDAYS(start_date, end_date)', description: 'Returns the number of whole workdays between two dates (excluding weekends).', example: '=NETWORKDAYS(A1, B1)' },

  // Statistical
  { name: 'COUNT', category: 'Statistical', syntax: 'COUNT(range)', description: 'Counts how many numbers are in a range.', example: '=COUNT(A1:A50)' },
  { name: 'COUNTA', category: 'Statistical', syntax: 'COUNTA(range)', description: 'Counts how many cells are not empty in a range.', example: '=COUNTA(A1:A50)' },
  { name: 'COUNTIF', category: 'Statistical', syntax: 'COUNTIF(range, criteria)', description: 'Counts cells in a range that meet a given criteria.', example: '=COUNTIF(A1:A50, ">100")' },
  { name: 'COUNTIFS', category: 'Statistical', syntax: 'COUNTIFS(criteria_range1, criteria1, ...)', description: 'Counts cells specified by a given set of conditions or criteria.', example: '=COUNTIFS(A1:A50, ">100", B1:B50, "West")' },
];

// Convert column index (0-based) to letter (A, B, C, ... Z, AA, AB...)
export function colIndexToLetter(col: number): string {
  let temp = col + 1;
  let letter = '';
  while (temp > 0) {
    const mod = (temp - 1) % 26;
    letter = String.fromCharCode(65 + mod) + letter;
    temp = Math.floor((temp - mod) / 26);
  }
  return letter;
}

// Convert column letter (A, B, C, ... Z, AA...) to 0-based index
export function letterToColIndex(letter: string): number {
  const upper = letter.toUpperCase();
  let column = 0;
  for (let i = 0; i < upper.length; i++) {
    column = column * 26 + (upper.charCodeAt(i) - 64);
  }
  return column - 1;
}

// Convert "A1" -> { row: 0, col: 0 }
export function parseCellReference(ref: string): { row: number; col: number } | null {
  const match = ref.trim().toUpperCase().match(/^([A-Z]+)([0-9]+)$/);
  if (!match) return null;
  const colLetter = match[1];
  const rowNum = parseInt(match[2], 10);
  if (isNaN(rowNum) || rowNum < 1) return null;
  return {
    row: rowNum - 1,
    col: letterToColIndex(colLetter),
  };
}

// Convert { row: 0, col: 0 } -> "A1"
export function formatCellReference(row: number, col: number): string {
  return `${colIndexToLetter(col)}${row + 1}`;
}

// Parse range "A1:B5" into array of cell coordinates
export function parseRange(rangeStr: string): { row: number; col: number }[] {
  const parts = rangeStr.split(':');
  if (parts.length === 1) {
    const single = parseCellReference(parts[0]);
    return single ? [single] : [];
  }
  if (parts.length === 2) {
    const start = parseCellReference(parts[0]);
    const end = parseCellReference(parts[1]);
    if (!start || !end) return [];

    const minRow = Math.min(start.row, end.row);
    const maxRow = Math.max(start.row, end.row);
    const minCol = Math.min(start.col, end.col);
    const maxCol = Math.max(start.col, end.col);

    const result: { row: number; col: number }[] = [];
    for (let r = minRow; r <= maxRow; r++) {
      for (let c = minCol; c <= maxCol; c++) {
        result.push({ row: r, col: c });
      }
    }
    return result;
  }
  return [];
}

// Shift formula cell references by rowDelta and colDelta for copy/paste & AutoFill
export function shiftFormulaReferences(formula: string, rowDelta: number, colDelta: number): string {
  if (!formula || !formula.startsWith('=')) return formula;
  return formula.replace(/\b([A-Za-z]+)([0-9]+)\b/g, (match, colStr, rowStr) => {
    const colIdx = letterToColIndex(colStr);
    const rowIdx = parseInt(rowStr, 10) - 1;
    const newCol = Math.max(0, colIdx + colDelta);
    const newRow = Math.max(0, rowIdx + rowDelta);
    return formatCellReference(newRow, newCol);
  });
}

/**
 * Main Formula Evaluator Entry Point
 */
export function evaluateFormula(
  formula: string,
  cells: Record<string, { value: string | number | null; formula?: string }>,
  visited: Set<string> = new Set()
): string | number | boolean {
  if (!formula || typeof formula !== 'string') return '';
  if (!formula.startsWith('=')) {
    const trimmed = formula.trim();
    return isNaN(Number(trimmed)) || trimmed === '' ? formula : Number(trimmed);
  }

  const expression = formula.substring(1).trim();
  if (!expression) return '';

  try {
    // Check for standard function invocation: FUNC(...)
    const funcMatch = expression.match(/^([A-Z0-9_]+)\((.*)\)$/i);
    if (funcMatch) {
      const funcName = funcMatch[1].toUpperCase();
      const rawArgs = funcMatch[2];
      return evaluateExcelFunction(funcName, rawArgs, cells, visited);
    }

    // Otherwise evaluate basic arithmetic expression
    return evaluateArithmeticExpression(expression, cells, visited);
  } catch (err) {
    return '#VALUE!';
  }
}

// Function Dispatch Engine
function evaluateExcelFunction(
  funcName: string,
  rawArgs: string,
  cells: Record<string, { value: string | number | null; formula?: string }>,
  visited: Set<string>
): string | number | boolean {
  const splitArgs = parseFunctionArgs(rawArgs);

  const getNumericValuesFromArg = (arg: string): number[] => {
    if (arg.includes(':')) {
      const rangeCells = parseRange(arg);
      const values: number[] = [];
      for (const coords of rangeCells) {
        const key = `${coords.row},${coords.col}`;
        const val = getCellValue(key, cells, visited);
        const num = Number(val);
        if (!isNaN(num) && val !== '' && val !== null) {
          values.push(num);
        }
      }
      return values;
    } else {
      const ref = parseCellReference(arg);
      if (ref) {
        const key = `${ref.row},${ref.col}`;
        const val = getCellValue(key, cells, visited);
        const num = Number(val);
        return isNaN(num) ? [] : [num];
      }
      const num = Number(arg);
      return isNaN(num) ? [] : [num];
    }
  };

  const getRawValuesFromArg = (arg: string): (string | number | boolean)[] => {
    if (arg.includes(':')) {
      const rangeCells = parseRange(arg);
      return rangeCells.map((coords) => getCellValue(`${coords.row},${coords.col}`, cells, visited));
    } else {
      const ref = parseCellReference(arg);
      if (ref) {
        return [getCellValue(`${ref.row},${ref.col}`, cells, visited)];
      }
      if (/^["'].*["']$/.test(arg.trim())) {
        return [arg.trim().slice(1, -1)];
      }
      return [arg.trim()];
    }
  };

  switch (funcName) {
    // Mathematical
    case 'SUM': {
      let sum = 0;
      for (const arg of splitArgs) {
        const nums = getNumericValuesFromArg(arg);
        sum += nums.reduce((a, b) => a + b, 0);
      }
      return sum;
    }

    case 'AVERAGE': {
      let nums: number[] = [];
      for (const arg of splitArgs) {
        nums = nums.concat(getNumericValuesFromArg(arg));
      }
      if (nums.length === 0) return '#DIV/0!';
      return nums.reduce((a, b) => a + b, 0) / nums.length;
    }

    case 'MIN': {
      let nums: number[] = [];
      for (const arg of splitArgs) {
        nums = nums.concat(getNumericValuesFromArg(arg));
      }
      if (nums.length === 0) return 0;
      return Math.min(...nums);
    }

    case 'MAX': {
      let nums: number[] = [];
      for (const arg of splitArgs) {
        nums = nums.concat(getNumericValuesFromArg(arg));
      }
      if (nums.length === 0) return 0;
      return Math.max(...nums);
    }

    case 'ROUND': {
      if (splitArgs.length < 1) return '#VALUE!';
      const numVal = Number(evaluateFormula(`=${splitArgs[0]}`, cells, visited));
      const decimals = splitArgs[1] ? parseInt(splitArgs[1], 10) : 0;
      if (isNaN(numVal)) return '#VALUE!';
      const factor = Math.pow(10, decimals);
      return Math.round(numVal * factor) / factor;
    }

    case 'ABS': {
      if (splitArgs.length < 1) return '#VALUE!';
      const numVal = Number(evaluateFormula(`=${splitArgs[0]}`, cells, visited));
      return isNaN(numVal) ? '#VALUE!' : Math.abs(numVal);
    }

    case 'POWER': {
      if (splitArgs.length < 2) return '#VALUE!';
      const base = Number(evaluateFormula(`=${splitArgs[0]}`, cells, visited));
      const exp = Number(evaluateFormula(`=${splitArgs[1]}`, cells, visited));
      if (isNaN(base) || isNaN(exp)) return '#VALUE!';
      return Math.pow(base, exp);
    }

    // Logical
    case 'IF': {
      if (splitArgs.length < 2) return '#VALUE!';
      const conditionStr = splitArgs[0];
      const valTrueStr = splitArgs[1];
      const valFalseStr = splitArgs[2] || '';

      const isTrue = evaluateCondition(conditionStr, cells, visited);
      const targetStr = isTrue ? valTrueStr : valFalseStr;

      if (/^["'].*["']$/.test(targetStr.trim())) {
        return targetStr.trim().slice(1, -1);
      }
      const ref = parseCellReference(targetStr.trim());
      if (ref) {
        return getCellValue(`${ref.row},${ref.col}`, cells, visited);
      }
      return isNaN(Number(targetStr)) ? targetStr : Number(targetStr);
    }

    case 'IFS': {
      if (splitArgs.length % 2 !== 0 && splitArgs.length < 2) return '#VALUE!';
      for (let i = 0; i < splitArgs.length; i += 2) {
        const cond = splitArgs[i];
        const val = splitArgs[i + 1];
        if (evaluateCondition(cond, cells, visited)) {
          if (/^["'].*["']$/.test(val.trim())) return val.trim().slice(1, -1);
          const ref = parseCellReference(val.trim());
          if (ref) return getCellValue(`${ref.row},${ref.col}`, cells, visited);
          return isNaN(Number(val)) ? val : Number(val);
        }
      }
      return '#N/A';
    }

    case 'AND': {
      if (splitArgs.length === 0) return '#VALUE!';
      for (const arg of splitArgs) {
        if (!evaluateCondition(arg, cells, visited)) return false;
      }
      return true;
    }

    case 'OR': {
      if (splitArgs.length === 0) return '#VALUE!';
      for (const arg of splitArgs) {
        if (evaluateCondition(arg, cells, visited)) return true;
      }
      return false;
    }

    case 'NOT': {
      if (splitArgs.length < 1) return '#VALUE!';
      return !evaluateCondition(splitArgs[0], cells, visited);
    }

    // Lookup & Reference
    case 'XLOOKUP': {
      if (splitArgs.length < 3) return '#VALUE!';
      const lookupValStr = resolveTokenValue(splitArgs[0], cells, visited);
      const lookupRange = parseRange(splitArgs[1]);
      const returnRange = parseRange(splitArgs[2]);
      const ifNotFound = splitArgs[3] ? resolveTokenValue(splitArgs[3], cells, visited) : '#N/A';

      if (lookupRange.length === 0 || returnRange.length === 0) return '#VALUE!';

      for (let i = 0; i < lookupRange.length; i++) {
        const key = `${lookupRange[i].row},${lookupRange[i].col}`;
        const val = getCellValue(key, cells, visited);
        if (String(val).toLowerCase() === String(lookupValStr).toLowerCase()) {
          const retCoords = returnRange[i] || returnRange[0];
          return getCellValue(`${retCoords.row},${retCoords.col}`, cells, visited);
        }
      }
      return ifNotFound;
    }

    case 'VLOOKUP': {
      if (splitArgs.length < 3) return '#VALUE!';
      const lookupValStr = resolveTokenValue(splitArgs[0], cells, visited);
      const rangeStr = splitArgs[1];
      const colIdx = parseInt(splitArgs[2], 10);

      const rangeCells = parseRange(rangeStr);
      if (rangeCells.length === 0 || isNaN(colIdx)) return '#VALUE!';

      const minRow = Math.min(...rangeCells.map((c) => c.row));
      const maxRow = Math.max(...rangeCells.map((c) => c.row));
      const minCol = Math.min(...rangeCells.map((c) => c.col));
      const targetCol = minCol + colIdx - 1;

      for (let r = minRow; r <= maxRow; r++) {
        const keyFirst = `${r},${minCol}`;
        const firstVal = getCellValue(keyFirst, cells, visited);
        if (String(firstVal).toLowerCase() === String(lookupValStr).toLowerCase()) {
          const targetKey = `${r},${targetCol}`;
          return getCellValue(targetKey, cells, visited);
        }
      }
      return '#N/A';
    }

    case 'HLOOKUP': {
      if (splitArgs.length < 3) return '#VALUE!';
      const lookupValStr = resolveTokenValue(splitArgs[0], cells, visited);
      const rangeStr = splitArgs[1];
      const rowIdx = parseInt(splitArgs[2], 10);

      const rangeCells = parseRange(rangeStr);
      if (rangeCells.length === 0 || isNaN(rowIdx)) return '#VALUE!';

      const minRow = Math.min(...rangeCells.map((c) => c.row));
      const minCol = Math.min(...rangeCells.map((c) => c.col));
      const maxCol = Math.max(...rangeCells.map((c) => c.col));
      const targetRow = minRow + rowIdx - 1;

      for (let c = minCol; c <= maxCol; c++) {
        const keyTop = `${minRow},${c}`;
        const topVal = getCellValue(keyTop, cells, visited);
        if (String(topVal).toLowerCase() === String(lookupValStr).toLowerCase()) {
          const targetKey = `${targetRow},${c}`;
          return getCellValue(targetKey, cells, visited);
        }
      }
      return '#N/A';
    }

    case 'INDEX': {
      if (splitArgs.length < 2) return '#VALUE!';
      const rangeCells = parseRange(splitArgs[0]);
      const rowNum = parseInt(splitArgs[1], 10);
      const colNum = splitArgs[2] ? parseInt(splitArgs[2], 10) : 1;

      if (rangeCells.length === 0 || isNaN(rowNum)) return '#VALUE!';

      const minRow = Math.min(...rangeCells.map((c) => c.row));
      const minCol = Math.min(...rangeCells.map((c) => c.col));
      const targetRow = minRow + rowNum - 1;
      const targetCol = minCol + colNum - 1;

      return getCellValue(`${targetRow},${targetCol}`, cells, visited);
    }

    case 'MATCH': {
      if (splitArgs.length < 2) return '#VALUE!';
      const lookupValStr = resolveTokenValue(splitArgs[0], cells, visited);
      const rangeCells = parseRange(splitArgs[1]);
      if (rangeCells.length === 0) return '#VALUE!';

      for (let i = 0; i < rangeCells.length; i++) {
        const key = `${rangeCells[i].row},${rangeCells[i].col}`;
        const val = getCellValue(key, cells, visited);
        if (String(val).toLowerCase() === String(lookupValStr).toLowerCase()) {
          return i + 1; // 1-based index
        }
      }
      return '#N/A';
    }

    // Text
    case 'LEFT': {
      if (splitArgs.length < 1) return '#VALUE!';
      const text = String(resolveTokenValue(splitArgs[0], cells, visited));
      const numChars = splitArgs[1] ? parseInt(splitArgs[1], 10) : 1;
      return text.slice(0, numChars);
    }

    case 'RIGHT': {
      if (splitArgs.length < 1) return '#VALUE!';
      const text = String(resolveTokenValue(splitArgs[0], cells, visited));
      const numChars = splitArgs[1] ? parseInt(splitArgs[1], 10) : 1;
      return text.slice(Math.max(0, text.length - numChars));
    }

    case 'MID': {
      if (splitArgs.length < 3) return '#VALUE!';
      const text = String(resolveTokenValue(splitArgs[0], cells, visited));
      const startNum = parseInt(splitArgs[1], 10);
      const numChars = parseInt(splitArgs[2], 10);
      if (isNaN(startNum) || isNaN(numChars) || startNum < 1) return '#VALUE!';
      return text.slice(startNum - 1, startNum - 1 + numChars);
    }

    case 'LEN': {
      if (splitArgs.length < 1) return '#VALUE!';
      const text = String(resolveTokenValue(splitArgs[0], cells, visited));
      return text.length;
    }

    case 'CONCATENATE':
    case 'CONCAT': {
      return splitArgs
        .map((arg) => {
          const vals = getRawValuesFromArg(arg);
          return vals.join('');
        })
        .join('');
    }

    case 'TEXTJOIN': {
      if (splitArgs.length < 3) return '#VALUE!';
      const delimiter = String(resolveTokenValue(splitArgs[0], cells, visited));
      const ignoreEmpty = String(resolveTokenValue(splitArgs[1], cells, visited)).toUpperCase() === 'TRUE';
      const items: string[] = [];

      for (let i = 2; i < splitArgs.length; i++) {
        const rawVals = getRawValuesFromArg(splitArgs[i]);
        for (const v of rawVals) {
          const str = String(v);
          if (!ignoreEmpty || str !== '') {
            items.push(str);
          }
        }
      }
      return items.join(delimiter);
    }

    // Date & Time
    case 'TODAY': {
      const now = new Date();
      return now.toISOString().split('T')[0];
    }

    case 'NOW': {
      const now = new Date();
      return now.toLocaleString();
    }

    case 'YEAR': {
      if (splitArgs.length < 1) return '#VALUE!';
      const val = String(resolveTokenValue(splitArgs[0], cells, visited));
      const date = new Date(val);
      return isNaN(date.getTime()) ? '#VALUE!' : date.getFullYear();
    }

    case 'MONTH': {
      if (splitArgs.length < 1) return '#VALUE!';
      const val = String(resolveTokenValue(splitArgs[0], cells, visited));
      const date = new Date(val);
      return isNaN(date.getTime()) ? '#VALUE!' : date.getMonth() + 1;
    }

    case 'DAY': {
      if (splitArgs.length < 1) return '#VALUE!';
      const val = String(resolveTokenValue(splitArgs[0], cells, visited));
      const date = new Date(val);
      return isNaN(date.getTime()) ? '#VALUE!' : date.getDate();
    }

    case 'NETWORKDAYS': {
      if (splitArgs.length < 2) return '#VALUE!';
      const startStr = String(resolveTokenValue(splitArgs[0], cells, visited));
      const endStr = String(resolveTokenValue(splitArgs[1], cells, visited));
      const start = new Date(startStr);
      const end = new Date(endStr);
      if (isNaN(start.getTime()) || isNaN(end.getTime())) return '#VALUE!';

      let count = 0;
      const cur = new Date(start);
      while (cur <= end) {
        const dayOfWeek = cur.getDay();
        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
          count++;
        }
        cur.setDate(cur.getDate() + 1);
      }
      return count;
    }

    // Statistical
    case 'COUNT': {
      let count = 0;
      for (const arg of splitArgs) {
        count += getNumericValuesFromArg(arg).length;
      }
      return count;
    }

    case 'COUNTA': {
      let count = 0;
      for (const arg of splitArgs) {
        const vals = getRawValuesFromArg(arg);
        count += vals.filter((v) => v !== '' && v !== null && v !== undefined).length;
      }
      return count;
    }

    case 'COUNTIF': {
      if (splitArgs.length < 2) return '#VALUE!';
      const rangeStr = splitArgs[0];
      const criteria = String(resolveTokenValue(splitArgs[1], cells, visited)).trim();

      const rangeCells = parseRange(rangeStr);
      let matchCount = 0;

      for (const coords of rangeCells) {
        const key = `${coords.row},${coords.col}`;
        const val = String(getCellValue(key, cells, visited));

        if (criteria.startsWith('>=')) {
          if (Number(val) >= Number(criteria.slice(2))) matchCount++;
        } else if (criteria.startsWith('<=')) {
          if (Number(val) <= Number(criteria.slice(2))) matchCount++;
        } else if (criteria.startsWith('>')) {
          if (Number(val) > Number(criteria.slice(1))) matchCount++;
        } else if (criteria.startsWith('<')) {
          if (Number(val) < Number(criteria.slice(1))) matchCount++;
        } else {
          if (val.toLowerCase() === criteria.toLowerCase()) matchCount++;
        }
      }
      return matchCount;
    }

    case 'COUNTIFS': {
      if (splitArgs.length < 2 || splitArgs.length % 2 !== 0) return '#VALUE!';
      const pairCount = splitArgs.length / 2;
      const rangeLists = [];
      const criteriaList = [];

      for (let i = 0; i < pairCount; i++) {
        rangeLists.push(parseRange(splitArgs[i * 2]));
        criteriaList.push(String(resolveTokenValue(splitArgs[i * 2 + 1], cells, visited)).trim());
      }

      const firstRange = rangeLists[0];
      let totalMatch = 0;

      for (let cellIdx = 0; cellIdx < firstRange.length; cellIdx++) {
        let allPairsMatch = true;
        for (let p = 0; p < pairCount; p++) {
          const coords = rangeLists[p][cellIdx];
          if (!coords) {
            allPairsMatch = false;
            break;
          }
          const val = String(getCellValue(`${coords.row},${coords.col}`, cells, visited));
          const crit = criteriaList[p];

          if (crit.startsWith('>=')) {
            if (!(Number(val) >= Number(crit.slice(2)))) allPairsMatch = false;
          } else if (crit.startsWith('<=')) {
            if (!(Number(val) <= Number(crit.slice(2)))) allPairsMatch = false;
          } else if (crit.startsWith('>')) {
            if (!(Number(val) > Number(crit.slice(1)))) allPairsMatch = false;
          } else if (crit.startsWith('<')) {
            if (!(Number(val) < Number(crit.slice(1)))) allPairsMatch = false;
          } else {
            if (val.toLowerCase() !== crit.toLowerCase()) allPairsMatch = false;
          }
          if (!allPairsMatch) break;
        }
        if (allPairsMatch) totalMatch++;
      }
      return totalMatch;
    }

    default:
      return '#NAME?';
  }
}

// Token helper to resolve strings / numbers / cell references
function resolveTokenValue(
  token: string,
  cells: Record<string, { value: string | number | null; formula?: string }>,
  visited: Set<string>
): string | number | boolean {
  const trimmed = token.trim();
  if (/^["'].*["']$/.test(trimmed)) {
    return trimmed.slice(1, -1);
  }
  const ref = parseCellReference(trimmed);
  if (ref) {
    return getCellValue(`${ref.row},${ref.col}`, cells, visited);
  }
  return isNaN(Number(trimmed)) ? trimmed : Number(trimmed);
}

// Split args by comma respecting quotes & nested parens
function parseFunctionArgs(raw: string): string[] {
  const args: string[] = [];
  let current = '';
  let inQuotes = false;
  let parenDepth = 0;

  for (let i = 0; i < raw.length; i++) {
    const char = raw[i];
    if (char === '"' || char === "'") inQuotes = !inQuotes;
    if (char === '(' && !inQuotes) parenDepth++;
    if (char === ')' && !inQuotes) parenDepth--;

    if (char === ',' && !inQuotes && parenDepth === 0) {
      args.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  if (current.trim()) args.push(current.trim());
  return args;
}

// Safe Cell Value retrieval with circular reference protection
function getCellValue(
  key: string,
  cells: Record<string, { value: string | number | null; formula?: string }>,
  visited: Set<string>
): string | number | boolean {
  if (visited.has(key)) return '#REF!';
  const cell = cells[key];
  if (!cell) return '';

  if (cell.formula) {
    const newVisited = new Set(visited);
    newVisited.add(key);
    return evaluateFormula(cell.formula, cells, newVisited);
  }
  return cell.value ?? '';
}

// Evaluate condition expression like "A1>50" or "B2='Enterprise'"
function evaluateCondition(
  condStr: string,
  cells: Record<string, { value: string | number | null; formula?: string }>,
  visited: Set<string>
): boolean {
  const operators = ['>=', '<=', '!=', '=', '>', '<'];
  let op = '';
  for (const o of operators) {
    if (condStr.includes(o)) {
      op = o;
      break;
    }
  }
  if (!op) return Boolean(condStr);

  const parts = condStr.split(op);
  const leftRaw = parts[0].trim();
  const rightRaw = parts[1].trim();

  const left = resolveTokenValue(leftRaw, cells, visited);
  const right = resolveTokenValue(rightRaw, cells, visited);

  switch (op) {
    case '>=':
      return Number(left) >= Number(right);
    case '<=':
      return Number(left) <= Number(right);
    case '!=':
      return String(left).toLowerCase() !== String(right).toLowerCase();
    case '=':
      return String(left).toLowerCase() === String(right).toLowerCase();
    case '>':
      return Number(left) > Number(right);
    case '<':
      return Number(left) < Number(right);
    default:
      return false;
  }
}

// Evaluate arithmetic expressions with cell reference substitution
function evaluateArithmeticExpression(
  expr: string,
  cells: Record<string, { value: string | number | null; formula?: string }>,
  visited: Set<string>
): number | string {
  const replaced = expr.replace(/([A-Z]+[0-9]+)/gi, (match) => {
    const ref = parseCellReference(match);
    if (!ref) return '0';
    const val = getCellValue(`${ref.row},${ref.col}`, cells, visited);
    const num = Number(val);
    return isNaN(num) ? '0' : String(num);
  });

  try {
    const sanitized = replaced.replace(/\^/g, '**');
    if (!/^[0-9+\-*/().\s*]+$/.test(sanitized)) {
      return '#VALUE!';
    }
    // eslint-disable-next-line no-eval
    const result = eval(sanitized);
    return isNaN(result) ? '#VALUE!' : result;
  } catch (err) {
    return '#VALUE!';
  }
}
