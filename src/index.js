import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthProvider } from './context/AuthProvider';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en.json';

import { ModalProvider } from './context/ModalProvider';

TimeAgo.addDefaultLocale(en);



const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
  
    <BrowserRouter>
      <AuthProvider>
        <ModalProvider>
          <Routes>
            <Route path="/*" element={<App />} />
          </Routes>
        </ModalProvider>
      </AuthProvider>
    </BrowserRouter>

);