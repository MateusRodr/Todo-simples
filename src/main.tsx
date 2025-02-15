import { createRoot } from 'react-dom/client';
import App from './App';
import './estilizacao/index.css';
import { BrowserRouter } from 'react-router-dom';
import React from 'react';

createRoot(document.getElementById('root') as HTMLElement).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
