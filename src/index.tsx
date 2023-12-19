import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import init, * as iw from './pkg/iw.js';

async function run() {
  await init();

  const elem = document.getElementById('root');
  if (elem != null) {
    const root = ReactDOM.createRoot(elem);
    root.render(
      <React.StrictMode>
        <App iw={iw}/>
      </React.StrictMode>
    );
  }
}

run();