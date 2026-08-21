/**
 * AnalyticsRise — Universal Workspace Context Builder
 * Connects any product workspace (SQL Studio, SQL Workspace, Excel Studio, Excel Workspace, Power BI)
 * to the unified AI-EVA intelligence engine.
 */

import { AiEvaContext, AiEvaWorkspaceType, AnalyticsRiseProduct } from '../types';
import { ExcelWorkspaceContextData } from './types';

export function createWorkspaceContext(
  product: AnalyticsRiseProduct,
  workspaceType: AiEvaWorkspaceType,
  options: {
    excelContext?: ExcelWorkspaceContextData;
    sqlQuery?: string;
    sqlError?: string;
    schema?: string;
    table?: string;
    additional?: Record<string, string | number | boolean>;
  } = {}
): AiEvaContext {
  return {
    product,
    workspaceType,
    excelContext: options.excelContext,
    currentQuery: options.sqlQuery,
    sqlError: options.sqlError,
    activeSchema: options.schema,
    activeTable: options.table,
    additionalContext: options.additional,
    privacyLevel: options.excelContext?.privacyLevel || 'metadata',
  };
}
