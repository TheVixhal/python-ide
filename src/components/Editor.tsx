import React, { useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import { oneDark } from '@codemirror/theme-one-dark';
import { usePyodide } from './PyodideProvider';

export function Editor() {
  const [code, setCode] = useState('print("Hello, World!")');
  const [output, setOutput] = useState('');
  const { pyodide, loading, error } = usePyodide();

  const runCode = async () => {
    if (!pyodide) return;
    
    try {
      // Clear previous output
      setOutput('');
      
      // Redirect Python stdout to capture print statements
      pyodide.runPython(`
        import sys
        from io import StringIO
        sys.stdout = StringIO()
      `);
      
      // Run the user's code
      await pyodide.runPythonAsync(code);
      
      // Get the captured output
      const stdout = pyodide.runPython('sys.stdout.getvalue()');
      setOutput(stdout);
      
      // Reset stdout
      pyodide.runPython('sys.stdout = sys.__stdout__');
    } catch (err) {
      setOutput(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Loading Python environment...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 p-4">
        Error loading Python environment: {error}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 min-h-0">
        <CodeMirror
          value={code}
          height="100%"
          theme={oneDark}
          extensions={[python()]}
          onChange={(value) => setCode(value)}
          className="h-full"
        />
      </div>
      
      <div className="flex gap-2 p-4 bg-gray-800">
        <button
          onClick={runCode}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
        >
          Run
        </button>
      </div>
      
      <div className="h-1/3 bg-black text-white p-4 font-mono overflow-auto">
        <pre>{output}</pre>
      </div>
    </div>
  );
}