import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';
import { ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';
import { MyContexts } from './Contexts';


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Router>
      <MyContexts>
        <App />
      </MyContexts>
    </Router>
    <ToastContainer  />
  </React.StrictMode>
);



