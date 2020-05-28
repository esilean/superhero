import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';

import 'mobx-react-lite/batchingForReactDom';

import ScrollToTop from './app/layout/scroll.to.top';
import App from './app/layout/app';

import 'react-toastify/dist/ReactToastify.css';
import 'react-datepicker/dist/react-datepicker.css';
import './styles/styles.css';

export const history = createBrowserHistory();

ReactDOM.render(
  // <React.StrictMode>
  <Router history={history}>
    <ScrollToTop>
      <App />
    </ScrollToTop>
  </Router>,
  // </React.StrictMode>,
  document.getElementById('root')
);
