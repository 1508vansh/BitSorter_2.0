import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import App from "./App";
import Register from "./authentication/register";
import Login from "./authentication/login";
import { store } from "./stores/store";
import { Provider, useDispatch, useSelector } from "react-redux";
import { authenticateUser } from "./slices/authSlice";
import Navbar from "./components/navbar";
import Home from "./Pages/home";
import ProblemPage from "./Pages/problemPage";
import ProfilePage from "./Pages/profilePage";
import Loader from "./Ui/Loader";

function Main() {
  const dispatch = useDispatch();
  const { isAuthorized,loading } = useSelector((state) => state.auth);
  useEffect(() => {
    dispatch(authenticateUser());
  }, [dispatch]);
  console.log(isAuthorized);

  const CenteredLoader = () => (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      width: '100vw',
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 50,
      background: 'rgba(255,255,255,0.7)'
    }}>
      <Loader />
    </div>
  );

  return (
    <Routes>
      <Route
        path="/register"
        element={loading ? <CenteredLoader /> : isAuthorized ? <Navigate to="/" /> : <Register />}
      />
      <Route
        path="/login"
        element={loading ? <CenteredLoader /> : isAuthorized ? <Navigate to="/" /> : <Login />}
      />
      {/* path = "*" is used , when user hit any random path in url other than defined like login, register , home etc. */}
      <Route
        path="*"
        element={loading ? <CenteredLoader /> : isAuthorized ? <App /> : <Navigate to="/register" />}
      />
    </Routes>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <Main/>
    </BrowserRouter>
  </Provider>
);
