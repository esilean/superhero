import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import 'mobx-react-lite/batchingForReactDom';

import ScrollToTop from './app/layout/scroll.to.top';
import App from './app/layout/app';
import './styles/styles.css';

ReactDOM.render(
  // <React.StrictMode>
  <BrowserRouter>
    <ScrollToTop>
      <App />
    </ScrollToTop>
  </BrowserRouter>,
  // </React.StrictMode>,
  document.getElementById('root')
);
