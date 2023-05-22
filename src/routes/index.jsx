import React from "react";

import App from '../App.jsx';

import Login from "../pages/Login.jsx";
import Students from "../pages/Students.jsx";
import User from "../pages/User.jsx";
import Register from "../pages/Register.jsx"

import ErrorPage from "../pages/ErrorPage.jsx";


const Routes = [
  {
    path: "/",
    element: <App/>,
    errorElement: <ErrorPage/>,
    children: [
      {
        path: "/",
        element: <Login/>
      },
      {
        path: "/students",
        element: <Students/>
      },
      {
        path: "/user",
        element: <User/>
      },
      {
        path: "/login",
        element: <Login/>
      },
      {
        path: "/register",
        element: <Register/>
      }

    ]
  },

]

export default Routes;
