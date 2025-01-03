import React from 'react';
import ReactDOM from 'react-dom/client';
import { CssBaseline } from '@mui/material';
import { StyledEngineProvider } from '@mui/styled-engine';
import 'perfect-scrollbar/css/perfect-scrollbar.css';
import { BrowserRouter } from 'react-router-dom';
import App from './app/App';
// import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux';
import {store} from "./app/redux/store"
import { Toaster } from 'react-hot-toast';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <StyledEngineProvider injectFirst>
  <BrowserRouter>
    <CssBaseline />
    <Provider store={store}>
    <Toaster
  position="top-center"
  reverseOrder={false}
/>
    <App />
    </Provider>
  </BrowserRouter>
</StyledEngineProvider>,
);



