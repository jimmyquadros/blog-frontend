import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import { createRoot } from 'react-dom/client';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en.json';
import './index.css';
import App from './App';
import { ModalProvider } from './context/ModalProvider';
import PersistLogin from './components/PersistLogin';
import {ErrorProvider} from './context/ErrorProvider';

TimeAgo.addDefaultLocale(en);
const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
    <BrowserRouter>
      <ErrorProvider>
        <AuthProvider>
          <PersistLogin>
            <ModalProvider>
              <Routes>
                <Route path="/*" element={<App />} />
              </Routes>
            </ModalProvider>
          </PersistLogin>
        </AuthProvider>
      </ErrorProvider>
    </BrowserRouter>
);
