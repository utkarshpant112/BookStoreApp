import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { HelmetProvider } from "react-helmet-async";
import Store from "./Store";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";

ReactDOM.render(
  <React.StrictMode>
    <Provider store={Store}>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
registerServiceWorker();
