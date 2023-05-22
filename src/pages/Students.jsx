import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle, FaTrashAlt, FaPencilAlt, FaExclamation, FaUserPlus } from 'react-icons/fa';

import { get } from 'lodash';

import axios from '../services/axios';

import Modal from '../components/Modal/StudentModal';
import Loading from '../components/Loading/Loading';


export default function Students() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [loginInfos, setUserInfos] = useState(useSelector((state) =>  {
    return state.auth;
  }))

  useEffect(()=> {
    if(!loginInfos.isLoggedIn){
      toast.error('You are not currently logged in, please login again.');
      navigate('/login');
    }
  }, [navigate, loginInfos])


  const [students, setStudents] = useState([]);
  const [openModal, setOpenModal] = useState({open:false, student:{}})


  useEffect(() => {
    async function getData() {
      setIsLoading(true);
      const response = await axios.get('/students');
      setStudents(response.data);
      setIsLoading(false);
    }

    getData();
  }, []);

  const handleDeleteAsk = (e) => {
    e.preventDefault();
    const exclamation = e.currentTarget.nextSibling;
    exclamation.setAttribute('style', {display:"block"});
    e.currentTarget.remove();
  };

  const handleDelete = async (e, id, index) => {
    e.persist();

    try {
      setIsLoading(true);
      await axios.delete(`/students/${id}`);
      const newStudents = [...students];
      newStudents.splice(index, 1);
      setStudents(newStudents);
      setIsLoading(false);
    } catch (err) {
      const status = get(err, 'response.status', 0);

      if (status === 401) {
        toast.error('You need be logged to manipulate students infos.');
      } else {
        toast.error('Error to exclude student.');
      }
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-full flex flex-1 flex-col container mx-auto sm:mx-auto sm:w-full sm:max-w-lg">
        <ul role="list" className="divide-y divide-gray-100 overflow-auto  overflow-y-scroll max-h-96">
          {students.map((student, index) => (
            <li key={student.email} className="flex justify-between gap-x-6 py-5">

            <div className="flex gap-x-4">

              {get(student, 'Photos[0].url', false) ? (
                <img
                className="h-12 w-12 flex-none rounded-full bg-gray-50 cursor-pointer"
                src={student.Photos[0].url}
                />
              ) : (
                <FaUserCircle
                className='text-zinc-300'
                size={48}
               />
              )}

              <div className="min-w-0 flex-auto">
                  <p className="text-sm font-semibold leading-6 text-gray-900">{student.first_name} {student.last_name}</p>
                  <p className="mt-1 truncate text-xs leading-5 text-zinc-500">{student.email}</p>
              </div>

            </div>
              <div className="flex items-center justify-center w-12">
                  <FaPencilAlt
                  size={18}
                  cursor="pointer"
                  className="ml-2 text-purple-500"
                  onClick={(e) => setOpenModal({
                    open: true,
                    student,
                  })}
                />

                <FaTrashAlt
                  size={16}
                  cursor="pointer"
                  className="ml-2 text-purple-500"
                  onClick={(e) => handleDeleteAsk(e)}
                />

                <FaExclamation
                  size={16}
                  cursor="pointer"
                  onClick={(e) => handleDelete(e, student.id, index)}
                  style={{display:"none"}}
                  className="ml-2 "
                />
              </div>
            </li>
          ))}
        </ul>

        <Loading
          isLoading={isLoading}
        />

        <Modal
          infos={openModal}
          setOpenModal={() => setOpenModal({
            open: !openModal.open,
            student: openModal.student
          })}
        />

      </div>

      <div>
        <FaUserPlus
          size={40}
          cursor="pointer"
          className="float-right mb-6 mr-6 text-zinc-500"
          onClick={() => setOpenModal({
            open: !openModal.open,
            student: {}
          })}
        />
      </div>
    </>
  )
}
