import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { NotificationProvider } from './context/NotificationContext';
import { Toaster } from 'react-hot-toast';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <NotificationProvider>
      <App />
      <Toaster position="top-right" reverseOrder={false} />
    </NotificationProvider>
  </React.StrictMode>
);

// Optional: Log performance
reportWebVitals();
