import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from 'react-router-dom';

import * as actions from '../../store/modules/auth/actions';


export default function Nav () {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoggedIn } = useSelector(rootReducer => rootReducer.auth ? rootReducer.auth : null);


  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(actions.loginFailure());
    navigate('/login');
  };

    return (
      <nav className="bg-purple-500 mb-24 h-20 flex justify-end text-lg">

          <div className="flex flex-wrap items-center justify-between p-4 float-right">
              <div className="hidden w-full md:block md:w-auto" id="navbar-default">
                  <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 md:flex-row md:space-x-8 md:mt-0 text-white">

                      { isLoggedIn ? (
                        <>
                          <li>
                            <Link to="/students" className="md:hover:text-gray-200 md:p-0 ">Students</Link>
                          </li>

                          <li>
                            <Link to="/user" className="md:hover:text-gray-200 md:p-0 ">Account</Link>
                          </li>

                          <li
                          className="md:hover:text-gray-200 md:p-0 cursor-pointer"
                          onClick={handleLogout}>
                            Logout
                          </li>

                        </>
                          ) : (
                            <>
                              <li>
                                <Link to="/login" className="md:hover:text-gray-200 md:p-0 ">Login</Link>
                              </li>

                              <li>
                                <Link to="/register" className="md:hover:text-gray-200 md:p-0 ">Register</Link>
                              </li>
                            </>

                      )}
                  </ul>
              </div>
          </div>
      </nav>
    )
}
