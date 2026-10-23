import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import Orders from "./Orders.jsx";
import "./styles.css";

const isOrders = window.location.pathname.replace(/\/$/, "") === "/orders";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {isOrders ? <Orders /> : <App />}
  </StrictMode>,
);
