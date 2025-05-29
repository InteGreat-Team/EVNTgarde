import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import reportWebVitals from "./reportWebVitals.ts";
import "./index.css";
import { AuthProvider } from "./functions/AuthContext";

// REMOVE these lines:
// import express from 'express';
// const app = express();
// app.use(express.json());

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);

reportWebVitals();