import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import HomeScreen from "./pages/home/HomeScreen";
import CreateUser from "./pages/create/CreateUser";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import UpdateUser from "./pages/update/UpdateUser";

const routes = [
  { path: "/", name: "Home", component: HomeScreen },
  { path: "/create", name: "create", component: CreateUser },
  { path: "/:id", name: "update", component: UpdateUser },
];

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {routes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={<route.component />}
          />
        ))}
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
