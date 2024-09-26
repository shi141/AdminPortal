import React, { useState, useEffect } from 'react';
import { useSelector,useDispatch } from 'react-redux';
import "./styles/App.css";
import { useNavigate } from 'react-router-dom';


export default function App(){
  const navigate=useNavigate();
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [usernameError, setUsernameError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const dispatch=useDispatch();
  const user_name = useSelector((state) => state.username);
  
  const handleSubmit = async (e) => {
    e.preventDefault(); 
    const dictionary={'username':username,'password':password};
    try {
      const response = await fetch(`http://127.0.0.1:800/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dictionary)
      });
      const data=await response.json();
      // navigate('/user_access'); 
      // alert('Login successful'); 
      // setUsername('');
      // setPassword(''); 
      if (response.ok) {
        console.log(JSON.stringify(data));
        dispatch({type:'login_success',payload:dictionary});
        
        localStorage.setItem("access_token",data.access_token);
        navigate('/home_page'); 
         
        setUsername('');
        setPassword('');
        
      }
       else {
        alert('Failed to add user');
        dispatch({type:'login_fail',payload:'an error occured'});
        // dispatch({
        //   type:setfail,
        //   payload:"login failed",
        // })
      }
      
    } catch (error) {
      console.error('Error:', error);
      alert("Wrong login");
    }
    
  };
  const handleregister=()=>{
    setUsername('');
    setPassword('');
    navigate('/register');
  }
  

  return (
    
    <div className='main'>
    <div className='Container' >
      <div className={'titleContainer'}>
        <div>Sign In</div>
      </div>
      <br />
      <div className={'inputContainer'}>
        <input
        type="text"
          value={username}
          placeholder="Username"
          onChange={(ev) => setUsername(ev.target.value)}
          className={'inputBox1'} style={{width:"400px"}}
        />
        <label className="errorLabel">{usernameError}</label>
      </div>
      <br />
      <div className={'inputContainer'}>
        <input
        type="password"
          value={password}
          placeholder="Password"
          onChange={(ev) => setPassword(ev.target.value)}
          className={'inputBox2'} style={{width:"400px"}}
        />
        <label className="errorLabel">{passwordError}</label>
      </div>
      <br />
      <div className={'loginbutton'}>
      <div className='regiterutton'><p className="account">Don't have an account ?<button className='register' onClick={handleregister}>Register</button></p></div>
      <button className='login' onClick={handleSubmit} variant="contained" >Log In</button>
      
      </div>
    </div>
    </div>



  
  )
}

 