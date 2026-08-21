/**
 * AnalyticsRise — AI-EVA Intelligent In-Browser Pedagogical Engine
 * Provides rich, deterministic, pedagogical AI assistance when running in
 * browser sandboxes, offline environments, or before server backend configuration.
 */

import { IAiEvaProvider } from './types';
import { AiEvaRequest, AiEvaResponse } from '../types';

export class IntelligentFallbackProvider implements IAiEvaProvider {
  public readonly providerId = 'eva-intelligent-fallback';
  public readonly defaultModel = 'eva-pedagogical-v1';

  public async generateResponse(request: AiEvaRequest): Promise<AiEvaResponse> {
    const question = request.userQuestion.trim().toLowerCase();
    const context = request.context;
    let responseText = '';
    let codeSnippet: string | undefined;
    let suggestedPrompts: string[] = [
      'Explain this query',
      'Explain JOINs',
      'Give me a hint',
      'What should I learn next?',
    ];

    // Scenario 1: SQL Error Diagnosis
    if (context?.sqlError && (question.includes('error') || question.includes('fix') || question.includes('wrong') || question.includes('help'))) {
      const diagnosis = this.diagnoseSqlError(context.sqlError, context.currentQuery);
      responseText = diagnosis.text;
      codeSnippet = diagnosis.snippet;
      suggestedPrompts = ['Explain this query', 'Give me a hint', 'Show best practices'];
    }
    // Scenario 2: Explain Current Query
    else if (question.includes('explain this query') || question.includes('explain query') || (question.includes('explain') && context?.currentQuery)) {
      responseText = this.explainQuery(context?.currentQuery);
      suggestedPrompts = ['How can I optimize this?', 'Help me fix this error', 'Give me a hint'];
    }
    // Scenario 3: Requesting a Hint for active challenge
    else if (question.includes('hint') || question.includes('clue') || question.includes('stuck')) {
      responseText = this.generateChallengeHint(context);
      suggestedPrompts = ['Explain this query', 'Help me fix this error', 'What should I learn next?'];
    }
    // Scenario 4: Conceptual Question about JOINs
    else if (question.includes('join')) {
      responseText = `### 🔗 Understanding SQL JOINs\n\nA **JOIN** allows you to combine rows from two or more tables based on a related column between them:\n\n- **INNER JOIN**: Returns only rows that have matching values in **both** tables.\n- **LEFT JOIN** *(Most Common)*: Returns **all** rows from the left table, and the matched rows from the right table. Unmatched right-table columns become \`NULL\`.\n- **RIGHT JOIN**: Returns all rows from the right table, and matched rows from the left.\n- **FULL OUTER JOIN**: Returns all rows when there is a match in either left or right table.\n\n💡 **Key Tip**: Always ensure the columns in your \`ON\` condition share the same data type (e.g., \`orders.customer_id = customers.id\`).`;
      codeSnippet = `-- Example of a LEFT JOIN\nSELECT \n    customers.name,\n    orders.order_id,\n    orders.amount\nFROM customers\nLEFT JOIN orders \n    ON customers.id = orders.customer_id;`;
      suggestedPrompts = ['Difference between WHERE and HAVING', 'Explain GROUP BY', 'Explain this query'];
    }
    // Scenario 5: Conceptual Question about WHERE vs HAVING
    else if (question.includes('having') || (question.includes('where') && question.includes('difference'))) {
      responseText = `### ⚖️ WHERE vs. HAVING in SQL\n\nThe fundamental difference is **when** the filter is evaluated:\n\n1. **WHERE**: Filters individual rows **before** any aggregation (\`GROUP BY\`) occurs. You *cannot* use aggregate functions like \`COUNT()\` or \`SUM()\` in a \`WHERE\` clause.\n2. **HAVING**: Filters grouped summary rows **after** aggregation has occurred.\n\n💡 **SQL Order of Execution**:\n1. \`FROM\` & \`JOIN\`\n2. \`WHERE\` (row filter)\n3. \`GROUP BY\` (aggregation)\n4. \`HAVING\` (group filter)\n5. \`SELECT\` (columns & aliases)\n6. \`ORDER BY\`\n7. \`LIMIT\``;
      codeSnippet = `SELECT category, COUNT(*) AS total_items\nFROM products\nWHERE status = 'active'     -- Filters rows before grouping\nGROUP BY category\nHAVING COUNT(*) > 5;        -- Filters groups after counting`;
      suggestedPrompts = ['Explain GROUP BY', 'Explain JOINs', 'Give me a hint'];
    }
    // Scenario 6: Conceptual Question about GROUP BY
    else if (question.includes('group by') || question.includes('aggregate')) {
      responseText = `### 📊 How GROUP BY Works\n\n\`GROUP BY\` groups rows with identical values in specified columns into summary rows (e.g., finding the total sales per region).\n\n**The Golden Rule of GROUP BY**:\nEvery non-aggregated column in your \`SELECT\` clause **must** be listed in the \`GROUP BY\` clause.\n\nCommon Aggregates:\n- \`COUNT(column)\`: Counts non-null values\n- \`SUM(column)\`: Totals numeric values\n- \`AVG(column)\`: Calculates average\n- \`MAX(column)\` / \`MIN(column)\`: Peak / lowest value`;
      codeSnippet = `SELECT \n    region,\n    COUNT(order_id) AS total_orders,\n    SUM(revenue) AS total_revenue\nFROM sales_data\nGROUP BY region\nORDER BY total_revenue DESC;`;
      suggestedPrompts = ['Difference between WHERE and HAVING', 'Explain this query', 'Give me a hint'];
    }
    // Scenario 7: What should I learn next / Career Progression
    else if (question.includes('next') || question.includes('roadmap') || question.includes('career')) {
      responseText = `### 🚀 Recommended Learning Progression\n\nBased on your current session in **SQL Studio**, here is the optimal ascension path:\n\n1. **Core Foundations**: \`SELECT\`, \`WHERE\` filtering, and \`ORDER BY\` sorting.\n2. **Relational Analysis**: Multi-table \`INNER JOIN\` and \`LEFT JOIN\` data modeling.\n3. **Business Aggregations**: \`GROUP BY\`, \`HAVING\`, and revenue metric calculations.\n4. **Advanced Querying**: Window functions (\`ROW_NUMBER()\`, \`RANK()\`) and Common Table Expressions (\`WITH\` CTEs).\n5. **Real-World Capability**: Jump into **SQL Workspace** to upload and query your own datasets!`;
      suggestedPrompts = ['Explain JOINs', 'Explain this query', 'Give me a hint'];
    }
    // Fallback: General Encouraging Pedagogical Guidance
    else {
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

    const lines = query.trim().split('\n');
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
