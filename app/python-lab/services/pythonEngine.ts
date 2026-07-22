// app/python-lab/services/pythonEngine.ts
// This service abstracts Python code execution. It supports two modes:
// 1. Pyodide (client‑side WebAssembly) – loads from CDN on first use.
// 2. Cloud Function – sends code to a server endpoint.

let pyodide: any = null;
const execMode = process.env.NEXT_PUBLIC_PY_EXEC_MODE || 'pyodide'; // default

export async function setExecutionMode(mode: 'pyodide' | 'cloud') {
  if (mode !== 'pyodide' && mode !== 'cloud') return;
  // In a real app you might store this in a context/reducer.
  // For simplicity we just set a global variable.
  (globalThis as any)._pyExecMode = mode;
}

export async function executeCell(code: string): Promise<string> {
  const mode = (globalThis as any)._pyExecMode || execMode;
  if (mode === 'pyodide') {
    if (!pyodide && typeof window !== 'undefined') {
      if (!(window as any).loadPyodide) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js';
          script.onload = () => resolve();
          script.onerror = reject;
          document.head.appendChild(script);
        });
      }
      pyodide = await (window as any).loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/' });
    }
    try {
      const result = await pyodide.runPythonAsync(code);
      // Convert result to string for UI display
      return typeof result === 'string' ? result : JSON.stringify(result);
    } catch (e: any) {
      throw new Error(e.message || 'Python execution error');
    }
  } else {
    // Cloud Function path – POST to /api/executePython
    const response = await fetch('/api/executePython', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    });
    if (!response.ok) {
      const err = await response.text();
      throw new Error(err || 'Cloud execution failed');
    }
    const data = await response.json();
    if (data.error) throw new Error(data.error);
    return data.output;
  }
}
