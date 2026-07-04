export const logInfo = (message: string, data?: any) => {
  console.info(`[INFO] ${message}`, data ?? '');
};

export const logError = (error: Error | string, data?: any) => {
  console.error(`[ERROR] ${error instanceof Error ? error.message : error}`, data ?? '');
};

export const logMetric = (name: string, value: number, tags?: Record<string, string>) => {
  // Simple placeholder – integrate with Firebase Analytics or other monitoring later
  console.log(`[METRIC] ${name}: ${value}`, tags ?? {});
};
