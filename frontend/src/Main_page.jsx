import React from "react";
import "./App.css";
import { useNavigate } from 'react-router-dom';

export default function Main_page(){
    const navigate=useNavigate();

    function handleLogin(){
        navigate('/login');
    }

    return(
        <div className={'mainContainer'}>
      <div className={'titleContainer'}>Welcome to the portal</div>
      <br/>
      <div className={'button'}>
      {/* <div className={'buttonRegister'} > */}
        <button class='registerbutton'>Register</button>
      {/* </div>
      <div className={'buttonLogin'}> */}
        <button class='login' onClick={handleLogin}>Login</button>
        {/* </div> */}
      </div>
    </div>
    )
}