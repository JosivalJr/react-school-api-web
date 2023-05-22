import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { isEmail } from 'validator';

import * as actions from '../store/modules/auth/actions';
import axios from '../services/axios';


export default function Login(props) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    async function handleLoginClick () {

      try {
        setIsLoading(true);
        let formErrors = false;

        if (!isEmail(email)) {
          formErrors = true;
          toast.error('Invalid email.');
        }

        if (password.length < 6 || password.length > 50) {
          formErrors = true;
          toast.error('Invalid password.');
        }

        if (formErrors) return;

        const response = await axios.post('/tokens/', {
          email, password
        });

      dispatch(actions.loginSuccess({ ...response.data }));
      setIsLoading(false);
      toast.success('Logged.');

      axios.defaults.headers.Authorization = `Bearer ${response.data.token}`;

      navigate('/students')

      } catch (e) {
        setIsLoading(false);
        toast.error('Fail to login.');
        dispatch(actions.loginFailure());
      }
    }

    return (
      <>
        <div className="flex min-h-full flex-1 flex-col lg:px-8 p-10">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2  className="text-3xl mb-4"> Sign in</h2>
            <h2 className="">
              Sign in to your account
            </h2>
          </div>

          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    name="email"
                    value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email"
                    className="border border-gray-400 py-1 px-2 w-full"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                    Password
                  </label>
                  <div className="text-sm">
                    {/* <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                      Forgot password?
                    </a> */}
                  </div>
                </div>
                <div className="mt-2">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Your password"
                    className="border border-gray-400 py-1 px-2 w-full"
                  />
                </div>
              </div>

              <div>
                <input
                  type="button"
                  value="Sign In"
                  className="w-full bg-purple-500 py-3 text-center text-white cursor-pointer"
                  default
                  onClick={handleLoginClick}
                />

              </div>
            </form>

            <p className="mt-10 text-center text-sm text-gray-500">
              Not registered?
              <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-500 ml-1">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </>
    )
  }
