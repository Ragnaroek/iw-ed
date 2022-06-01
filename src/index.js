import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import init, * as wasm from './pkg/iwlib.js';

init().then((wasm_loaded) => {
  console.log("init");
  console.log(wasm.m_test);
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(
    <React.StrictMode>
      <App wasm={wasm}/>
    </React.StrictMode>
  );
});