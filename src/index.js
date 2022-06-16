import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import init, * as wasm from './pkg/libiw.js';

init().then((wasm_loaded) => {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(
    <React.StrictMode>
      <App wasm={wasm}/>
    </React.StrictMode>
  );
});