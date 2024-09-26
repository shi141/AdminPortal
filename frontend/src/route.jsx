import React from 'react';
import { Routes, Route } from 'react-router-dom';
import App from './App'; 
import Login from './Loginpage';
import Add_file from './Add_file';
import Register from './register.jsx';  
import { Provider } from 'react-redux';
import store from './store.js';
import Project_details from './project_details.jsx';
import Project_page from './project_page.jsx';
import Home_page from './home_page.jsx';
import Admin_details from './admin_details.jsx';
import UploadCsv from './csvFile.jsx';

export default function Routes_user() {
  return (
    <Provider store={store}>
    <div>
      <Routes>
        <Route path='/' element={<App/>}/>
        <Route path='/projectdetails' element={<Project_details/>}/>
        <Route path='/addfile' element={<Add_file/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path="/admin" element={<Admin_details/>}/>
        <Route path='/project_page/:id' element={<Project_page/>}/>
        <Route path="/home_page" element ={<Home_page/>}/>
        <Route path="/user_access" element={<Login />} /> 
        <Route path="/uploadCsv" element={<UploadCsv/>}/>
      </Routes>
    </div>
    </Provider>
  );
}

