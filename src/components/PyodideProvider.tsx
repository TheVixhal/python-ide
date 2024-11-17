import React, { createContext, useContext, useEffect, useState } from 'react';
import { loadPyodide, type PyodideInterface } from 'pyodide';

interface PyodideContextType {
  pyodide: PyodideInterface | null;
  loading: boolean;
  error: string | null;
}

const PyodideContext = createContext<PyodideContextType>({
  pyodide: null,
  loading: true,
  error: null,
});

export const usePyodide = () => useContext(PyodideContext);

export function PyodideProvider({ children }: { children: React.ReactNode }) {
  const [pyodide, setPyodide] = useState<PyodideInterface | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function initPyodide() {
      try {
        const pyodideInstance = await loadPyodide({
          indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/',
        });
        setPyodide(pyodideInstance);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load Pyodide');
      } finally {
        setLoading(false);
      }
    }
    initPyodide();
  }, []);

  return (
    <PyodideContext.Provider value={{ pyodide, loading, error }}>
      {children}
    </PyodideContext.Provider>
  );
}