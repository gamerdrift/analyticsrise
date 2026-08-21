/**
 * AnalyticsRise — AI-EVA Intelligent In-Browser Pedagogical Engine
 * Provides rich, deterministic, pedagogical AI assistance across SQL Studio
 * and Excel Workspace when running in browser sandboxes, offline, or before server backend configuration.
 */

import { IAiEvaProvider } from './types';
import { AiEvaRequest, AiEvaResponse } from '../types';
import { ExcelWorkspaceContextData, ExcelFormulaContext } from '../context/types';

export class IntelligentFallbackProvider implements IAiEvaProvider {
  public readonly providerId = 'eva-intelligent-fallback';
  public readonly defaultModel = 'eva-pedagogical-v1';

  public async generateResponse(request: AiEvaRequest): Promise<AiEvaResponse> {
    const question = request.userQuestion.trim().toLowerCase();
    const context = request.context;

    // Route based on product context
    if (context?.product === 'excel-workspace') {
      return this.handleExcelWorkspaceRequest(question, context.excelContext);
    }

    return this.handleSqlStudioRequest(question, context);
  }

  // ==========================================================================
  // EXCEL WORKSPACE INTELLIGENCE
  // ==========================================================================

  private handleExcelWorkspaceRequest(
    question: string,
    excelContext?: ExcelWorkspaceContextData
  ): AiEvaResponse {
    let responseText = '';
    let codeSnippet: string | undefined;
    let suggestedPrompts: string[] = [
      'Understand my data',
      'Check data quality',
      'What can I analyze?',
      'Suggest a chart',
    ];

    const activeFormula = excelContext?.activeFormula;
    const isErrorQuestion =
      question.includes('error') ||
      question.includes('fix') ||
      question.includes('wrong') ||
      question.includes('why') ||
      question.includes('#') ||
      question.includes('issue') ||
      question.includes('diagnos') ||
      question.includes('broken');

    // 1. Formula Error Diagnosis
    if (
      (activeFormula?.errorState || activeFormula?.formulaText?.includes('#') || question.includes('#')) &&
      isErrorQuestion
    ) {
      const errorDiagnosis = this.diagnoseExcelError(activeFormula);
      responseText = errorDiagnosis.text;
      codeSnippet = errorDiagnosis.snippet;
      suggestedPrompts = ['Explain this formula', 'Check data quality', 'Suggest a chart'];
    }

    // 2. Explain Selected / Specific Formula
    else if (
      question.includes('explain this formula') ||
      question.includes('explain formula') ||
      question.includes('xlookup') ||
      question.includes('vlookup') ||
      question.includes('sumifs') ||
      question.includes('index/match') ||
      question.includes('index match') ||
      (question.includes('explain') && activeFormula?.formulaText)
    ) {
      const formulaExplanation = this.explainExcelFormula(activeFormula?.formulaText || question);
      responseText = formulaExplanation.text;
      codeSnippet = formulaExplanation.snippet;
      suggestedPrompts = ['Suggest formulas', 'What can I analyze?', 'Suggest a chart'];
    }
    // 3. Data Quality & Cleaning Guidance
    else if (
      question.includes('quality') ||
      question.includes('clean') ||
      question.includes('missing') ||
      question.includes('null') ||
      question.includes('duplicate') ||
      question.includes('profiler')
    ) {
      responseText = this.guideDataCleaning(excelContext);
      suggestedPrompts = ['What can I analyze?', 'Suggest formulas', 'Suggest a chart'];
    }
    // 4. Analysis Suggestions
    else if (
      question.includes('what can i analyze') ||
      question.includes('analyze') ||
      question.includes('insight') ||
      question.includes('ideas') ||
      question.includes('understand my data')
    ) {
      responseText = this.suggestExcelAnalyses(excelContext);
      suggestedPrompts = ['Suggest a chart', 'Suggest formulas', 'Check data quality'];
    }
    // 5. Visualization / Chart Recommendations
    else if (
      question.includes('chart') ||
      question.includes('visualiz') ||
      question.includes('graph') ||
      question.includes('plot')
    ) {
      responseText = this.recommendExcelCharts(excelContext);
      suggestedPrompts = ['What can I analyze?', 'Suggest formulas', 'Check data quality'];
    }
    // 6. Formula Builder & Formula Suggestions
    else if (
      question.includes('suggest formula') ||
      question.includes('formula builder') ||
      question.includes('how to calculate') ||
      question.includes('how do i calculate') ||
      question.includes('sum') ||
      question.includes('growth') ||
      question.includes('lookup')
    ) {
      const formulaBuild = this.suggestExcelFormulas(excelContext, question);
      responseText = formulaBuild.text;
      codeSnippet = formulaBuild.snippet;
      suggestedPrompts = ['Suggest a chart', 'What can I analyze?', 'Check data quality'];
    }
    // 7. Workflow / How to upload & get started
    else if (
      question.includes('upload') ||
      question.includes('what can i do here') ||
      question.includes('workflow') ||
      question.includes('starter')
    ) {
      responseText = this.guideExcelWorkflow(excelContext);
      suggestedPrompts = ['Understand my data', 'What can I analyze?', 'Suggest a chart'];
    }
    // 8. General Excel Workspace Greeting & Assistance
    else {
      responseText = `Hello! I'm **AI-EVA**, your AnalyticsRise spreadsheet companion. 📊\n\nI can help you explore, clean, formulate, and analyze your workbook:\n\n- **Formula Intelligence**: Explain functions (\`XLOOKUP\`, \`SUMIFS\`), diagnose errors (\`#VALUE!\`, \`#REF!\`), and build calculations.\n- **Data Quality**: Review missing values, mixed types, and data hygiene findings from the profiler.\n- **Analysis & Insights**: Recommend business metrics, trends, and KPIs tailored to your sheet's columns.\n- **Chart Recommendations**: Suggest the optimal chart type (Line, Bar, Donut) based on your data patterns.\n\n🔒 *Your workbook data stays safely in your browser unless you explicitly share a selected range sample with me.*`;
      suggestedPrompts = ['Understand my data', 'Check data quality', 'What can I analyze?', 'Suggest a chart'];
    }

    return {
      id: `eva_excel_${Date.now()}`,
      content: responseText,
      codeSnippet,
      suggestedPrompts,
      modelUsed: this.defaultModel,
      providerUsed: this.providerId,
      finishReason: 'stop',
      timestamp: new Date().toISOString(),
      usage: {
        promptTokens: question.length / 4,
        completionTokens: responseText.length / 4,
        totalTokens: (question.length + responseText.length) / 4,
      },
    };
  }

  private diagnoseExcelError(formulaContext?: ExcelFormulaContext): { text: string; snippet?: string } {
    const errorStr = (formulaContext?.errorState || formulaContext?.formulaText || '').toUpperCase();
    const cellAddr = formulaContext?.cellAddress || 'selected cell';

    if (errorStr.includes('#VALUE!') || errorStr.includes('VALUE')) {
      return {
        text: `### 🔍 Diagnosing \`#VALUE!\` in ${cellAddr}\n\nThe **#VALUE!** error occurs when a formula encounters a data type mismatch—typically attempting a mathematical operation on text.\n\n**Common Causes**:\n1. A referenced cell contains text instead of a number (e.g. \`"N/A"\` or spaces).\n2. Date values formatted as plain text strings that cannot be parsed mathematically.\n3. An incorrect argument type passed into a math function.\n\n💡 **Troubleshooting Steps**:\n- Use \`=ISNUMBER(cell)\` to check if referenced values are true numbers.\n- Wrap text-number conversions with \`=VALUE(cell)\`.\n- For conditional sums, use \`=SUMIFS()\` instead of direct \`+\` additions.`,
        snippet: `=IFERROR(SUM(A2:A10), 0)`,
      };
    }

    if (errorStr.includes('#REF!') || errorStr.includes('REF')) {
      return {
        text: `### 🔍 Diagnosing \`#REF!\` in ${cellAddr}\n\nThe **#REF!** error indicates an **invalid cell reference**.\n\n**Common Causes**:\n1. A row, column, or worksheet referenced by the formula was deleted or moved.\n2. A formula was copied past the boundaries of the spreadsheet grid.\n3. Dynamic range offset extends beyond valid sheet boundaries.\n\n💡 **Solution**: Inspect the formula in the formula bar and replace any missing \`#REF!\` coordinates with valid column ranges.`,
      };
    }

    if (errorStr.includes('#DIV/0!') || errorStr.includes('DIV')) {
      return {
        text: `### 🔍 Diagnosing \`#DIV/0!\` in ${cellAddr}\n\nThe formula is attempting to divide a value by zero or an empty cell.\n\n💡 **Safe Formula Pattern**:\nWrap the division in an \`IF\` or \`IFERROR\` statement:`,
        snippet: `=IF(B2=0, 0, A2/B2)`,
      };
    }

    if (errorStr.includes('#NAME?') || errorStr.includes('NAME')) {
      return {
        text: `### 🔍 Diagnosing \`#NAME?\` in ${cellAddr}\n\nExcel does not recognize text within the formula.\n\n**Common Causes**:\n1. **Misspelled function name**: e.g., \`=SUUM(A1:A10)\` instead of \`=SUM(A1:A10)\`.\n2. **Unquoted text strings**: Text literals inside formulas must be wrapped in double quotes (e.g. \`"Active"\`).\n3. **Missing colon in range**: e.g., \`A1A10\` instead of \`A1:A10\`.`,
      };
    }

    if (errorStr.includes('#N/A') || errorStr.includes('N/A')) {
      return {
        text: `### 🔍 Diagnosing \`#N/A\` in ${cellAddr}\n\nThe lookup function (\`XLOOKUP\`, \`VLOOKUP\`, or \`MATCH\`) could not find a matching value in the lookup table.\n\n💡 **Recommended Fix with XLOOKUP**:\nUse the built-in 4th argument of \`XLOOKUP\` (\`if_not_found\`):`,
        snippet: `=XLOOKUP(A2, Products!A:A, Products!B:B, "Not Found")`,
      };
    }

    return {
      text: `### ⚠️ Formula Error in ${cellAddr}\n\nThe active formula returned an error state: \`${formulaContext?.errorState || 'Invalid calculation'}\`.\n\nCheck that all referenced cell coordinates and data types align with the worksheet columns.`,
    };
  }

  private explainExcelFormula(formulaInput: string): { text: string; snippet?: string } {
    const inputUpper = formulaInput.toUpperCase();

    if (inputUpper.includes('XLOOKUP')) {
      return {
        text: `### 📖 Understanding \`XLOOKUP\`\n\n**XLOOKUP** is Excel's modern, flexible lookup function that replaces both \`VLOOKUP\` and \`HLOOKUP\` without column counting limitations.\n\n**Syntax**:\n\`=XLOOKUP(lookup_value, lookup_array, return_array, [if_not_found], [match_mode])\`\n\n**Key Advantages**:\n- Can look to the left (unlike standard \`VLOOKUP\`).\n- Defaults to an exact match without needing \`FALSE\`.\n- Handles missing values gracefully via \`[if_not_found]\`.\n- Does not break when columns are inserted or deleted.`,
        snippet: `=XLOOKUP(E2, customers!A:A, customers!C:C, "Unknown Customer")`,
      };
    }

    if (inputUpper.includes('SUMIFS')) {
      return {
        text: `### 📖 Understanding \`SUMIFS\`\n\n**SUMIFS** adds values in a range that meet one or more specified criteria across multiple columns.\n\n**Syntax**:\n\`=SUMIFS(sum_range, criteria_range1, criteria1, [criteria_range2, criteria2, ...])\`\n\n**Important Rule**:\nThe \`sum_range\` is always the **first** argument in \`SUMIFS\` (unlike single-condition \`SUMIF\`).`,
        snippet: `=SUMIFS(Total_Revenue, Region, "North", Status, "Active")`,
      };
    }

    if (inputUpper.includes('VLOOKUP')) {
      return {
        text: `### 📖 Understanding \`VLOOKUP\`\n\n**VLOOKUP** searches for a value in the leftmost column of a table array and returns a value in the same row from a specified column index.\n\n**Syntax**:\n\`=VLOOKUP(lookup_value, table_array, col_index_num, [range_lookup])\`\n\n💡 **Tip**: Always use \`FALSE\` as the 4th argument for exact matching. For modern spreadsheets, \`XLOOKUP\` is recommended!`,
        snippet: `=VLOOKUP(A2, Products!A:D, 3, FALSE)`,
      };
    }

    if (inputUpper.includes('INDEX') && inputUpper.includes('MATCH')) {
      return {
        text: `### 📖 Understanding \`INDEX / MATCH\`\n\nThe classic dynamic combination for robust two-way lookups:\n\n- \`MATCH(lookup_value, lookup_range, 0)\`: Finds the numerical row position.\n- \`INDEX(return_range, row_num)\`: Retrieves the value at that row position.`,
        snippet: `=INDEX(Products!C:C, MATCH(A2, Products!A:A, 0))`,
      };
    }

    return {
      text: `### 📖 Formula Explanation\n\nWhen reading formulas in Excel:\n1. Formulas always start with \`=\`.\n2. Arguments inside parentheses are separated by commas \`,\`.\n3. Text criteria must be enclosed in quotes (e.g. \`"Active"\`).\n4. Cell ranges are specified with a colon (e.g. \`A2:A100\`).`,
    };
  }

  private guideDataCleaning(excelContext?: ExcelWorkspaceContextData): string {
    if (!excelContext) {
      return `### 🧹 Spreadsheet Data Cleaning Best Practices\n\n1. **Standardize Headers**: Ensure row 1 has unique, lowercase or PascalCase names without special symbols.\n2. **Handle Missing Values**: Decide whether nulls should be filled with defaults (e.g., \`0\` or \`"Unknown"\`) or excluded.\n3. **Verify Data Types**: Ensure numbers and dates aren't stored as plain text.\n4. **Trim Whitespace**: Remove leading/trailing spaces using \`=TRIM()\`.`;
    }

    let response = `### 🧹 Data Quality Profile for "${excelContext.activeSheetName}"\n\n`;

    if (excelContext.dataQuality && excelContext.dataQuality.warnings.length > 0) {
      response += `**Identified Data Hygiene Issues**:\n`;
      for (const w of excelContext.dataQuality.warnings) {
        response += `- ⚠️ ${w}\n`;
      }
      response += `\n**Recommended Cleaning Actions**:\n`;
      response += `1. Use the **Data Profiler** on the left panel to inspect column distributions.\n`;
      response += `2. If headers contain duplicate names, rename them to ensure formulas and pivot charts reference unique keys.\n`;
      response += `3. For empty cells in numeric columns, consider imputing with \`0\` or the column average.`;
    } else {
      response += `✅ **Great news!** The Data Profiler did not detect any critical schema warnings on this worksheet.\n\n- Total Rows: **${excelContext.rowCount}**\n- Total Columns: **${excelContext.colCount}**\n- All column headers appear unique and properly structured for analysis.`;
    }

    return response;
  }

  private isNumericColumn(type: string): boolean {
    const t = type.toLowerCase();
    return t.includes('number') || t.includes('currency') || t.includes('int') || t.includes('decimal') || t.includes('float');
  }

  private isDateColumn(type: string): boolean {
    const t = type.toLowerCase();
    return t.includes('date') || t.includes('time');
  }

  private isCategoryColumn(type: string): boolean {
    const t = type.toLowerCase();
    return t.includes('text') || t.includes('string') || t.includes('category') || t.includes('bool');
  }

  private suggestExcelAnalyses(excelContext?: ExcelWorkspaceContextData): string {
    if (!excelContext || !excelContext.columns || excelContext.columns.length === 0) {
      return `### 💡 Analysis Suggestions\n\nOnce you upload a dataset, I will inspect your column headers and data types to suggest specific business KPIs, trends, and segment breakdowns!`;
    }

    const cols = excelContext.columns.map((c) => c.name);
    const numCols = excelContext.columns.filter((c) => this.isNumericColumn(c.inferredType)).map((c) => c.name);
    const dateCols = excelContext.columns.filter((c) => this.isDateColumn(c.inferredType)).map((c) => c.name);
    const catCols = excelContext.columns.filter((c) => this.isCategoryColumn(c.inferredType)).map((c) => c.name);

    let suggestions = `### 📊 Analytical Opportunities for "${excelContext.activeSheetName}"\n\nBased on your detected columns ([${cols.join(', ')}]), here are recommended analyses to explore:\n\n`;

    if (dateCols.length > 0 && numCols.length > 0) {
      suggestions += `1. 📈 **Time Series Trend**: Plot \`${numCols[0]}\` over \`${dateCols[0]}\` to identify seasonality, monthly growth, and peak volume periods.\n`;
    }

    if (catCols.length > 0 && numCols.length > 0) {
      suggestions += `2. 🏢 **Segment Performance**: Group by \`${catCols[0]}\` to compute total and average \`${numCols[0]}\` using \`SUMIFS\` or a Pivot Table.\n`;
    }

    if (catCols.length > 1 && numCols.length > 0) {
      suggestions += `3. 🔀 **Cross-Dimensional Matrix**: Compare \`${catCols[0]}\` vs \`${catCols[1]}\` to reveal which segment pairs generate the highest volume.\n`;
    }

    if (numCols.length >= 2) {
      suggestions += `4. 🎯 **Unit Economics / Efficiency**: Calculate ratios between \`${numCols[0]}\` and \`${numCols[1]}\` (e.g. Revenue per Unit or Profit Margin).\n`;
    }

    return suggestions;
  }

  private recommendExcelCharts(excelContext?: ExcelWorkspaceContextData): string {
    if (!excelContext || !excelContext.columns) {
      return `### 📉 Chart Selection Framework\n\n- **Time Series (Date + Value)**: Line Chart\n- **Categorical Comparison (Category + Value)**: Bar / Column Chart\n- **Composition / Share**: Donut Chart (max 5 slices)\n- **Correlation (Value + Value)**: Scatter Plot`;
    }

    const numCols = excelContext.columns.filter((c) => this.isNumericColumn(c.inferredType));
    const dateCols = excelContext.columns.filter((c) => this.isDateColumn(c.inferredType));
    const catCols = excelContext.columns.filter((c) => this.isCategoryColumn(c.inferredType));

    let text = `### 📊 Visualization Recommendations for "${excelContext.activeSheetName}"\n\n`;

    if (dateCols.length > 0 && numCols.length > 0) {
      text += `1. **Line Chart (Recommended for Trends)**:\n   - **X-Axis**: \`${dateCols[0].name}\`\n   - **Y-Axis**: \`${numCols[0].name}\`\n   - **Why**: Best for tracking progression, growth rate, and cyclic patterns over time.\n\n`;
    }

    if (catCols.length > 0 && numCols.length > 0) {
      text += `2. **Bar / Column Chart (Recommended for Comparison)**:\n   - **Categories**: \`${catCols[0].name}\`\n   - **Values**: \`${numCols[0].name}\`\n   - **Why**: Clean, immediate comparison between discrete categories without visual distortion.\n\n`;
    }

    if (catCols.length > 0 && catCols[0].distinctCount && catCols[0].distinctCount <= 5 && numCols.length > 0) {
      text += `3. **Donut / Pie Chart (Part-to-Whole)**:\n   - **Slices**: \`${catCols[0].name}\` (${catCols[0].distinctCount} categories)\n   - **Values**: \`${numCols[0].name}\`\n   - **Why**: Ideal because there are 5 or fewer categories, preventing slice clutter.`;
    }

    return text;
  }


  private suggestExcelFormulas(excelContext?: ExcelWorkspaceContextData, query?: string): { text: string; snippet?: string } {
    const colNames = excelContext?.columns?.map((c) => c.name) || ['Region', 'Revenue', 'Units', 'Date'];
    const numCol = excelContext?.columns?.find((c) => c.inferredType === 'number' || c.inferredType === 'currency')?.name || 'Total_Revenue';
    const catCol = excelContext?.columns?.find((c) => c.inferredType === 'text' || c.inferredType === 'category')?.name || 'Region';

    return {
      text: `### 🧮 Recommended Formula Patterns\n\nBased on your active columns (\`${colNames.join('`, `')}\`), here are formulas for your sheet:\n\n1. **Conditional Total by Category**:\n   Calculates total \`${numCol}\` where \`${catCol}\` equals a target value.\n\n2. **Top Average Calculation**:\n   \`=AVERAGEIF(${catCol}, "Target", ${numCol})\`\n\n3. **Safe Error Handling Wrapper**:\n   \`=IFERROR(calculation, 0)\``,
      snippet: `=SUMIFS(${numCol}, ${catCol}, "North")`,
    };
  }

  private guideExcelWorkflow(excelContext?: ExcelWorkspaceContextData): string {
    return `### 🚀 Excel Workspace Workflow Guide\n\nAnalyticsRise Excel Workspace allows you to analyze your own spreadsheet files in-browser with zero server data leakage:\n\n1. **Upload**: Click **Upload Workbook** to import any \`.csv\`, \`.tsv\`, or \`.xlsx\` file.\n2. **Profile**: Open the **Data Profiler** on the left panel to inspect column statistics, data types, and quality alerts.\n3. **Formulate**: Write Excel formulas (\`SUM\`, \`AVERAGE\`, \`XLOOKUP\`, \`SUMIFS\`) in the formula bar.\n4. **Visualize**: Click **Create Chart** in the toolbar to generate interactive charts.\n5. **Save & Export**: Save projects to browser storage or export clean CSVs anytime.`;
  }

  // ==========================================================================
  // SQL STUDIO INTELLIGENCE (PRESERVED FROM MISSION 08)
  // ==========================================================================

  private handleSqlStudioRequest(question: string, context?: any): AiEvaResponse {
    let responseText = '';
    let codeSnippet: string | undefined;
    let suggestedPrompts: string[] = [
      'Explain this query',
      'Explain JOINs',
      'Give me a hint',
      'What should I learn next?',
    ];

    if (context?.sqlError && (question.includes('error') || question.includes('fix') || question.includes('wrong') || question.includes('help'))) {
      const diagnosis = this.diagnoseSqlError(context.sqlError, context.currentQuery);
      responseText = diagnosis.text;
      codeSnippet = diagnosis.snippet;
      suggestedPrompts = ['Explain this query', 'Give me a hint', 'Show best practices'];
    } else if (question.includes('explain this query') || question.includes('explain query') || (question.includes('explain') && context?.currentQuery)) {
      responseText = this.explainQuery(context?.currentQuery);
      suggestedPrompts = ['How can I optimize this?', 'Help me fix this error', 'Give me a hint'];
    } else if (question.includes('hint') || question.includes('clue') || question.includes('stuck')) {
      responseText = this.generateChallengeHint(context);
      suggestedPrompts = ['Explain this query', 'Help me fix this error', 'What should I learn next?'];
    } else if (question.includes('join')) {
      responseText = `### 🔗 Understanding SQL JOINs\n\nA **JOIN** allows you to combine rows from two or more tables based on a related column between them:\n\n- **INNER JOIN**: Returns only rows that have matching values in **both** tables.\n- **LEFT JOIN** *(Most Common)*: Returns **all** rows from the left table, and the matched rows from the right table. Unmatched right-table columns become \`NULL\`.\n- **RIGHT JOIN**: Returns all rows from the right table, and matched rows from the left.\n- **FULL OUTER JOIN**: Returns all rows when there is a match in either left or right table.\n\n💡 **Key Tip**: Always ensure the columns in your \`ON\` condition share the same data type (e.g., \`orders.customer_id = customers.id\`).`;
      codeSnippet = `-- Example of a LEFT JOIN\nSELECT \n    customers.name,\n    orders.order_id,\n    orders.amount\nFROM customers\nLEFT JOIN orders \n    ON customers.id = orders.customer_id;`;
      suggestedPrompts = ['Difference between WHERE and HAVING', 'Explain GROUP BY', 'Explain this query'];
    } else if (question.includes('having') || (question.includes('where') && question.includes('difference'))) {
      responseText = `### ⚖️ WHERE vs. HAVING in SQL\n\nThe fundamental difference is **when** the filter is evaluated:\n\n1. **WHERE**: Filters individual rows **before** any aggregation (\`GROUP BY\`) occurs. You *cannot* use aggregate functions like \`COUNT()\` or \`SUM()\` in a \`WHERE\` clause.\n2. **HAVING**: Filters grouped summary rows **after** aggregation has occurred.\n\n💡 **SQL Order of Execution**:\n1. \`FROM\` & \`JOIN\`\n2. \`WHERE\` (row filter)\n3. \`GROUP BY\` (aggregation)\n4. \`HAVING\` (group filter)\n5. \`SELECT\` (columns & aliases)\n6. \`ORDER BY\`\n7. \`LIMIT\``;
      codeSnippet = `SELECT category, COUNT(*) AS total_items\nFROM products\nWHERE status = 'active'     -- Filters rows before grouping\nGROUP BY category\nHAVING COUNT(*) > 5;        -- Filters groups after counting`;
      suggestedPrompts = ['Explain GROUP BY', 'Explain JOINs', 'Give me a hint'];
    } else if (question.includes('group by') || question.includes('aggregate')) {
      responseText = `### 📊 How GROUP BY Works\n\n\`GROUP BY\` groups rows with identical values in specified columns into summary rows (e.g., finding the total sales per region).\n\n**The Golden Rule of GROUP BY**:\nEvery non-aggregated column in your \`SELECT\` clause **must** be listed in the \`GROUP BY\` clause.\n\nCommon Aggregates:\n- \`COUNT(column)\`: Counts non-null values\n- \`SUM(column)\`: Totals numeric values\n- \`AVG(column)\`: Calculates average\n- \`MAX(column)\` / \`MIN(column)\`: Peak / lowest value`;
      codeSnippet = `SELECT \n    region,\n    COUNT(order_id) AS total_orders,\n    SUM(revenue) AS total_revenue\nFROM sales_data\nGROUP BY region\nORDER BY total_revenue DESC;`;
      suggestedPrompts = ['Difference between WHERE and HAVING', 'Explain this query', 'Give me a hint'];
    } else if (question.includes('next') || question.includes('roadmap') || question.includes('career')) {
      responseText = `### 🚀 Recommended Learning Progression\n\nBased on your current session in **SQL Studio**, here is the optimal ascension path:\n\n1. **Core Foundations**: \`SELECT\`, \`WHERE\` filtering, and \`ORDER BY\` sorting.\n2. **Relational Analysis**: Multi-table \`INNER JOIN\` and \`LEFT JOIN\` data modeling.\n3. **Business Aggregations**: \`GROUP BY\`, \`HAVING\`, and revenue metric calculations.\n4. **Advanced Querying**: Window functions (\`ROW_NUMBER()\`, \`RANK()\`) and Common Table Expressions (\`WITH\` CTEs).\n5. **Real-World Capability**: Jump into **SQL Workspace** to upload and query your own datasets!`;
      suggestedPrompts = ['Explain JOINs', 'Explain this query', 'Give me a hint'];
    } else {
      responseText = `Hello! I'm **AI-EVA**, your AnalyticsRise learning companion. 👩‍💻\n\nI'm here to help you master data analytics by understanding concepts, debugging queries, and building real problem-solving confidence.\n\nYou can ask me to:\n- **Diagnose a SQL error** in your current editor.\n- **Explain how a complex query works** step-by-step.\n- **Give a pedagogical hint** without giving away the full answer.\n- **Explain core concepts** like JOINs, aggregations, subqueries, or window functions.\n\nWhat would you like to explore right now?`;
    }

    return {
      id: `eva_fallback_${Date.now()}`,
      content: responseText,
      codeSnippet,
      suggestedPrompts,
      modelUsed: this.defaultModel,
      providerUsed: this.providerId,
      finishReason: 'stop',
      timestamp: new Date().toISOString(),
      usage: {
        promptTokens: question.length / 4,
        completionTokens: responseText.length / 4,
        totalTokens: (question.length + responseText.length) / 4,
      },
    };
  }

  private diagnoseSqlError(error: string, query?: string): { text: string; snippet?: string } {
    const errLower = error.toLowerCase();

    if (errLower.includes('syntax error')) {
      return {
        text: `### 🔍 Syntax Error Detected\n\nThe database encountered a syntax issue: \`${error}\`.\n\n**Common Causes**:\n1. A missing or misplaced comma between column names in your \`SELECT\` statement.\n2. A mismatched quote around a string literal (e.g. \`'active\` instead of \`'active'\`).\n3. An incorrect keyword order (e.g. putting \`WHERE\` after \`GROUP BY\`).\n\nCheck the line indicated in the error message and verify your clause sequence.`,
      };
    }

    if (errLower.includes('no such column') || errLower.includes('unknown column')) {
      return {
        text: `### 🔍 Column Reference Error\n\nThe database cannot find the specified column: \`${error}\`.\n\n**Troubleshooting Steps**:\n1. Verify the column name spelling in the **Database Explorer** on the left panel.\n2. If joining multiple tables, prefix the column with the table name (e.g. \`customers.id\`).\n3. Check if you accidentally wrapped a column name in single quotes (which makes it a text string) instead of raw text.`,
      };
    }

    if (errLower.includes('aggregate') || errLower.includes('misuse of aggregate')) {
      return {
        text: `### 🔍 Aggregate Function Placement Error\n\nAggregate functions like \`COUNT()\`, \`SUM()\`, or \`AVG()\` cannot be evaluated inside a \`WHERE\` clause because \`WHERE\` filters rows *before* groups are calculated.\n\n💡 **Solution**: Move the condition to a \`HAVING\` clause following your \`GROUP BY\`.`,
        snippet: `-- Instead of:\n-- WHERE COUNT(*) > 10\n\n-- Use:\nGROUP BY category\nHAVING COUNT(*) > 10;`,
      };
    }

    if (errLower.includes('ambiguous')) {
      return {
        text: `### 🔍 Ambiguous Column Name\n\nBoth tables in your join have a column with the same name (often \`id\` or \`created_at\`), so the database doesn't know which one you want.\n\n💡 **Solution**: Disambiguate by prefixing the column with the table name or table alias (e.g. \`orders.id\` or \`o.id\`).`,
      };
    }

    return {
      text: `### ⚠️ SQL Execution Diagnostic\n\nThe database returned this message: \`${error}\`.\n\nTake a close look at the clauses in your query and check that table names, column names, and conditions match the active schema in the database explorer.`,
    };
  }

  private explainQuery(query?: string): string {
    if (!query || query.trim().length === 0) {
      return `There is currently no query in your SQL editor. Write a query or select a challenge to have me explain the logic!`;
    }

    let explanation = `### 📖 Query Breakdown\n\nHere is what your SQL query is doing step-by-step:\n\n`;

    const upper = query.toUpperCase();
    if (upper.includes('SELECT')) {
      explanation += `1. **SELECT Clause**: Identifies the specific data columns and calculations you want to output.\n`;
    }
    if (upper.includes('FROM')) {
      explanation += `2. **FROM Clause**: Specifies the primary source table containing the records.\n`;
    }
    if (upper.includes('JOIN')) {
      explanation += `3. **JOIN Clause**: Combines related records across tables using specified key relationships.\n`;
    }
    if (upper.includes('WHERE')) {
      explanation += `4. **WHERE Clause**: Filters rows so that only records matching your conditions are processed.\n`;
    }
    if (upper.includes('GROUP BY')) {
      explanation += `5. **GROUP BY Clause**: Aggregates individual rows into summary groups based on common values.\n`;
    }
    if (upper.includes('HAVING')) {
      explanation += `6. **HAVING Clause**: Filters the aggregated summary groups after calculation.\n`;
    }
    if (upper.includes('ORDER BY')) {
      explanation += `7. **ORDER BY Clause**: Sorts the resulting dataset in ascending or descending sequence.\n`;
    }
    if (upper.includes('LIMIT')) {
      explanation += `8. **LIMIT Clause**: Caps the number of returned rows for efficient reporting.\n`;
    }

    return explanation;
  }

  private generateChallengeHint(context?: any): string {
    if (!context?.challengeTitle) {
      return `### 💡 Problem-Solving Strategy\n\nWhen writing a query:\n1. Start by identifying the primary table in \`FROM\`.\n2. Check what condition or criteria is required in \`WHERE\`.\n3. Verify which specific columns are requested in \`SELECT\`.\n4. Run the query incrementally to inspect intermediate results!`;
    }

    return `### 💡 Hint for: "${context.challengeTitle}"\n\nLet's break this challenge into manageable steps:\n\n- **Target Table**: Check the active schema table for the relevant fields.\n- **Filtering**: Think about what condition uniquely identifies the rows asked for.\n- **Output Shape**: Ensure your \`SELECT\` column names match what the objective specifies.\n\nGive it a try in your editor, and run your query to check the live result table!`;
  }
}
