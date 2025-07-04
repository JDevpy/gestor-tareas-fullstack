import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { store } from "./app/store";
import "./styles/index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>: Herramienta para identificar problemas potenciales en la aplicación durante el desarrollo.
  <React.StrictMode>
    {/* <Provider store={store}>: Hace que el store de Redux esté disponible para todos los componentes anidados. */}
    <Provider store={store}>
      {/* <BrowserRouter>: Habilita el enrutamiento del lado del cliente usando la API de historial del navegador. */}
      <BrowserRouter>
        {/* <App />: El componente raíz de tu aplicación, donde se define la estructura y las rutas. */}
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
