import React from 'react';
import { PyodideProvider } from './components/PyodideProvider';
import { Editor } from './components/Editor';

function App() {
  return (
    <PyodideProvider>
      <Editor />
    </PyodideProvider>
  );
}

export default App;