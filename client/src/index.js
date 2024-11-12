// I. Importaciones necesarias
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

// II. Crear el nodo raíz para renderizar la aplicación
const root = ReactDOM.createRoot(document.getElementById('root'));

// III. Renderizar la aplicación
root.render(
 
    <BrowserRouter>
      <App />
    </BrowserRouter>

);
