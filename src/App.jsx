import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { Outlet } from "react-router-dom"

import Nav from './components/Nav/Navbar';
import Footer from './components/Footer/Footer';

import store, { persistor } from './store';

function App() {

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>

        <ToastContainer autoClose={200}/>
        <div className="min-h-screen flex flex-col">
          <Nav/>
          <Outlet></Outlet>
          <Footer className="mt-auto"/>
        </div>

      </PersistGate>
    </Provider>
  )
}

export default App
