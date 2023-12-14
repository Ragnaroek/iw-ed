import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import init, * as iw from './pkg/iw.js';

async function run() {

  // TODO init iw with iw_init here and use the loader to load the data
  // show placeholder until this is done

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