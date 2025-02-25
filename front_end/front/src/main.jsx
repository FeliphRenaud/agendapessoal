import React from 'react';
import ReactDom from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx';


ReactDom.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App/>
      </AuthProvider>      
    </BrowserRouter>
  </React.StrictMode>
)

