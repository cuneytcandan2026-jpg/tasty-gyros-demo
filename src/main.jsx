import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// The design system loads first so component stylesheets can override it —
// importing it after App.jsx puts the base .btn/.container rules last and they
// start winning against the components that mean to adjust them.
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
