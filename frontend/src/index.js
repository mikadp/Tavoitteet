import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.tailwindcss';
import App from './App';
import { AuthProvider } from './context/AuthContext';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <AuthProvider>
    <App />
  </AuthProvider>,
  document.getElementById("root")
);