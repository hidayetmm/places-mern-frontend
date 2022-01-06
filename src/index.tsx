import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import ThemeProvider from "./ThemeProvider";
import { BrowserRouter } from "react-router-dom";
import { NotificationsProvider } from "@mantine/notifications";
import "leaflet/dist/leaflet.css";
import "leaflet/dist/leaflet";

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider>
      <NotificationsProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </NotificationsProvider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
