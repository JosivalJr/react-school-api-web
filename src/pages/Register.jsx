import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import { isEmail } from 'validator';
import axios from '../services/axios';

import * as actions from '../store/modules/auth/actions';

const Register = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);

    const [first_name, setFirstName] = useState('');
    const [last_name, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    async function handleSubmit(e) {
        e.preventDefault();
        setIsLoading(true);

        let formErrors = false;

        if (first_name.length < 3 || first_name.length > 25) {
          formErrors = true;
          toast.error("'First Name' field must contain between 3 and 25 characters.");
        }

        if (last_name.length < 3 || last_name.length > 25) {
          formErrors = true;
          toast.error("'Last Name' field must contain between 3 and 25 characters.");
        }

        if (!isEmail(email)) {
          formErrors = true;
          toast.error('Invalid email.');
        }

        if (formErrors) {
          setIsLoading(false);
          return;
        }

        try {
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

          const response = await axios.post('/users/', {
            first_name, last_name, email, password
          });

          dispatch(actions.registerCreatedSuccess({ ...response.data }));
          setIsLoading(false);
          toast.success('Account created successfully!');
          navigate('/login')

        } catch (e) {
          if(e.response?.data?.errors){
            e.response?.data?.errors.map((error) => toast.error(error));
          } else {
            toast.error('Unknown error.');
          }
          setIsLoading(false);
          dispatch(actions.registerFailure());
        }

      }

    return (
      <div className="min-h-full flex flex-1 flex-col p-10 mx-auto">
          <div>
              <h2 className="text-3xl mb-4"> Register </h2>

              <p className="mb-4">
                Create your account.
              </p>

              <form onSubmit={handleSubmit}>

                <div className="grid grid-cols-2 gap-5">
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
                    <input
                      type="text"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="border border-gray-400 py-1 px-2 w-full"
                    />
                </div>

                <div className="mt-5">
                    <input
                      type="password"
                      placeholder="Password"
                      className="border border-gray-400 py-1 px-2 w-full"
                    />
                </div>

                <div className="mt-5">
                    <input type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Confirm Password"
                      className="border border-gray-400 py-1 px-2 w-full"
                    />
                </div>

                <div className="mt-5">
                  <button
                    type="submit"
                    default
                    className="w-full bg-purple-500 py-3 text-center text-white">Register Now
                  </button>
                </div>
              </form>
          </div>
      </div>
    )
}

export default Register;
