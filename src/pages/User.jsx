import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { isEmail } from 'validator';
import {get} from 'lodash';
import axios from '../services/axios';
import * as actions from '../store/modules/auth/actions';

import Loading from '../components/Loading/Loading';

export default function User () {
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const [loginInfos, setUserInfos] = useState(useSelector((state) =>  {
    return state.auth;
  }))
  const userInfos = loginInfos.user;

  useEffect(()=> {
    if(!loginInfos.isLoggedIn){
      toast.error('You are not currently logged in, please login again.');
      navigate('/login');
    }
  }, [navigate, loginInfos])

  const dispatch = useDispatch();

  const [first_name, setFirstName] = useState(userInfos.first_name);
  const [last_name, setLastName] = useState(userInfos.last_name);
  const [email, setEmail] = useState(userInfos.email);
  const [password, setPassword] = useState('');

  async function handleSubmit(e) {
    setIsLoading(true);
      e.preventDefault();

      let formErrors = false;

      if (first_name.length < 3 || first_name.length > 25) {
        formErrors = true;
        toast.error("'First Name' field must contain between 3 and 25 characters.");
      }

      if (last_name.length < 3 || last_name.length > 25) {
        formErrors = true;
        toast.error("'Last Name' field must contain between 3 and 25 characters.");
      }

      if (password.length < 6 || password.length > 50) {
        formErrors = true;
        toast.error('Invalid password.');
      }

      if (!isEmail(email)) {
        formErrors = true;
        toast.error('Invalid email.');
      }


      if (formErrors){
        setIsLoading(false);
        return;
      }


      try {
        setIsLoading(true);

        const response =  await axios.put('/users/', {
          first_name, last_name, email, password
        });

        toast.success('Account changed successfully!');

        dispatch(actions.registerUpdatedSuccess({
          first_name, last_name, email, password
        }));


      } catch (e) {
        const errors = get(e, 'response.data.errors', []);
        const status = get(e, 'response.status', 0);

        if (status === 401) {
          toast.error('You need to login again.');
          navigate('/login');
        }

        if (errors.length > 0) {
          errors.map((error) => toast.error(error));
        } else {
          toast.error('Unknown error.');
        }
        dispatch(actions.loginFailure());
      } finally {
        setIsLoading(false);
      }
    }

  return (
      <>
        <div className="min-h-full flex flex-1 flex-col container p-10 mx-auto max-w-lg min-w-sm">
            <div >
                <h2 className="text-3xl mb-4"> Account Management </h2>

                <p className="mb-4">
                  Edit your account.
                </p>

                <form onSubmit={handleSubmit}>

                  <div className="grid grid-cols-2 gap-2">
                    <label>Firstname: </label>
                    <label>Lastname: </label>
                    <input type="text"
                      placeholder="Firstname"
                      value={first_name}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="border border-gray-400 py-1 px-2"
                    />

                    <input type="text"
                      placeholder="Lastname"
                      value={last_name}
                      onChange={(e) => setLastName(e.target.value)}
                      className="border border-gray-400 py-1 px-2"
                    />
                  </div>

                  <div className="mt-5">
                  <label>Email: </label>
                      <input
                        type="text"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="border border-gray-400 py-1 px-2 w-full"
                      />
                  </div>

                  <div className="mt-5">
                  <label>Password: </label>
                      <input type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        className="border border-gray-400 py-1 px-2 w-full"
                      />
                  </div>

                  <div className="mt-5">
                    <button type="submit" className="w-full bg-purple-500 py-3 text-center text-white">Save</button>
                  </div>
                </form>
            </div>
        </div>

        <Loading
        isLoading={isLoading}
        />
    </>
    )
}
