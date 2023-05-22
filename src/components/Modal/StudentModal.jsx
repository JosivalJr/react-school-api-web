import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { FaRegWindowClose, FaUserCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';

import { get } from 'lodash';
import { isEmail, isInt, isFloat } from 'validator';

import * as actions from '../../store/modules/auth/actions';
import axios from '../../services/axios';

export default function Modal(props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { open, student } = props.infos;
  const {setOpenModal} = props;


  const {id} = student;
  const [first_name, setFirst_name] = useState('');
  const [last_name, setLast_name] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [photo, setPhoto] = useState([]);

  useEffect(()=>{
    if(id){
      setFirst_name(student.first_name);
      setLast_name(student.last_name);
      setEmail(student.email);
      setAge(student.age);
      setWeight(student.weight);
      setHeight(student.height);
      setPhoto(student.Photos);
    } else {
      setFirst_name('');
      setLast_name('');
      setEmail('');
      setAge('');
      setWeight('');
      setHeight('');
      setPhoto([]);
    }
  }, [id, student.Photos, student.age, student.email, student.first_name, student.height, student.last_name, student.weight])

  const photoContainer = document.getElementById("photoContainer");
  const uploadContainer = document.getElementById("uploadContainer");

  const handlePhotoSelect = (e) => {
    photoContainer.style.display = 'none';
    uploadContainer.style.display = 'block';
  }

  async function handleUpload (e){
    const file = e.target.files[0];
    const photoURL = URL.createObjectURL(file);

    setPhoto(photoURL);

    const formData = new FormData();
    formData.append('student_id', id);
    formData.append('photo', file);
    try {
      await axios.post('/photo/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Photo sended!');
      photoContainer.style.display = 'flex';
      uploadContainer.style.display = 'none';

      setOpenModal({
        open: !open,
        student: {}
      })

    } catch (err) {
      const { status } = get(err, 'response', '');
      toast.error('Error to upload photo.');

      if (status === 401) dispatch(actions.loginFailure());
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    let formErrors = false;

    if (first_name.length < 3 || first_name.length > 25) {
      toast.error('First Name must be between 3 and 25 characters');
      formErrors = true;
    }

    if (last_name.length < 3 || last_name.length > 25) {
      toast.error('Last Name must be between 3 and 25 characters');
      formErrors = true;
    }

    if (!isEmail(email)) {
      toast.error('Invalid Email.');
      formErrors = true;
    }

    if (!isInt(String(age))) {
      toast.error('Invalid Age.');
      formErrors = true;
    }

    if (!isFloat(String(weight))) {
      toast.error('Invalid Weight');
      formErrors = true;
    }

    if (!isFloat(String(height))) {
      toast.error('Invalid Height');
      formErrors = true;
    }

    if (formErrors) return;

    try {

      if (id) {
        await axios.put(`/students/${id}`, {
          first_name,
          last_name,
          email,
          age,
          weight,
          height,
        });
        toast.success('Student successfully edited!');
      } else {
        await axios.post(`/students/`, {
          first_name,
          last_name,
          email,
          age,
          weight,
          height,
        });
        toast.success('Student successfully created!');
      }
      setOpenModal({
        open: !open,
        student: {}
      })
      navigate('/students');

    } catch (err) {

      const status = get(err, 'response.status', 0);
      const data = get(err, 'response.data', {});
      const errors = get(data, 'errors', []);

      if (errors.length > 0) {
        errors.map((error) => toast.error(error));
      } else {
        toast.error('Unknown error');
      }

      if (status === 401) dispatch(actions.loginFailure());
    }
  };


  if(open){
    return (
      <div className="top-0 bottom-0 right-0 left-0 fixed bg-black bg-opacity-70">
        <div className="flex fixed justify-around items-center bottom-10 w-full h-full">
          <div className="bg-white">
            <div className='flex'>
              <FaRegWindowClose
                className="mr-5 mt-5 mb-5 ml-auto cursor-pointer bg"
                size={22}
                onClick={() => setOpenModal({
                  open: !open,
                  student: {}
                })
              }
              />
            </div>


            <form>
              <div
              id="photoContainer"
              className="flex justify-center items-center mt-10 ">
                {
                  photo.length > 0
                  ? <img
                  className="h-48 w-48 flex rounded-full bg-gray-50 cursor-pointer"
                  onClick={handlePhotoSelect}
                  src={photo[0].url}
                  />
                  : <FaUserCircle
                  className="cursor-pointer text-zinc-300"
                  onClick={handlePhotoSelect}
                  size={196}
                  />
                }
              </div>

              <div
                id="uploadContainer"
                className="flex items-center justify-center w-full "
                style={{display:"none"}}
              >
                  <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg aria-hidden="true" className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                    </div>
                    <input id="dropzone-file" type="file" onChange={handleUpload} className="hidden" />
                </label>
              </div>
            </form>

            <div className="container p-10 max-w-lg min-w-sm">
              <div >
                  <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 gap-2 mt-2 mb-3">
                    <label>Firstname:</label>
                    <label>Lastname:</label>
                      <input type="text"
                        name="firstname"
                        placeholder="Firstname"
                        value={first_name}
                        onChange={(e) => setFirst_name(e.target.value)}
                        className="border border-gray-400 py-1 px-2"
                      />

                      <input type="text"
                        placeholder="Lastname"
                        name="lastname"
                        value={last_name}
                        onChange={(e) => setLast_name(e.target.value)}
                        className="border border-gray-400 py-1 px-2"
                      />
                    </div>

                    <label>Email:</label>
                    <div className="mt-2 mb-3">
                        <input
                          type="text"
                          placeholder="Email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="border border-gray-400 py-1 px-2 w-full"
                        />
                    </div>


                    <div className="grid grid-cols-3 gap-2 mt-2 mb-2">
                    <label>Age:</label>
                    <label>Weight:</label>
                    <label>Height:</label>

                      <input
                        type="number"
                        step="1"
                        placeholder="Age"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        className="border border-gray-400 py-1 px-2 before:content-['y']"
                      />

                      <input
                        type="number"
                        step="0.1"
                        placeholder="Weight"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        className="border border-gray-400 py-1 px-2"
                      />

                      <input
                        type="number"
                        step="0.1"
                        placeholder="Height"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        className="border border-gray-400 py-1 px-2"
                      />
                    </div>

                    <div className="mt-5">
                      <button default type="submit" className="w-full bg-purple-500 py-3 text-center text-white">{id ? 'Save' : 'Create'}</button>
                    </div>
                  </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  } else {

    return null;
  }
}
