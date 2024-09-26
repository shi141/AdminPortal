import React, { useState,useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import './styles/register.css';

export default function Register(){
    const navigate=useNavigate()
    const [name,setName]=useState('')
    const [role,setRole]=useState('')
    const [user,setUser]=useState('')
    const [pass,setPass]=useState('')
    const[confirmpass,setConfirmpass]=useState('')
    

    const handlesignin=()=>{
        navigate('/')
    }
    const register=async (e)=>{
        e.preventDefault()
        if(pass==confirmpass){
            const dictionary={'login_name':name,'login_role':role,'username':user,'password':pass}
            try{
                const response=await fetch(`http://127.0.0.1:800/register`,{
                method:'POST',
                headers: {
                    'Content-Type': 'application/json'
                  },
                body:JSON.stringify(dictionary),
            });
                if (response.ok){
                    alert('Sign Up Successfull');
                    setName('');
                    setRole('');
                    setUser('');
                    setPass('');
                    setConfirmpass('');
                    navigate('/');
                }
                else{
                    alert("not successful");
                }
        }
        catch (error) {
            console.error('Error:', error);
            alert("Wrong login");
        }
    }
        else{
            alert('Confirm password doesnt match the password' )
        }
    }
    return(
        <div className="main-container">
        <div className="signup-box">
            <h1>Sign UP</h1>
            <form onSubmit={register}>
                <label>Name</label>
                <input type="text" placeholder="" onChange={(ev)=>setName(ev.target.value)}  required/>
                <label>Role</label>
                <input type="text" placeholder="" onChange={(ev)=>setRole(ev.target.value)} required/>
                <label>Username</label>
                <input type="text" placeholder="" onChange={(ev)=>setUser(ev.target.value)} required/>
                <label>Password</label>
                <input type="password" placeholder="" onChange={(ev)=>setPass(ev.target.value)} required/>
                <label>Confirm password</label>
                <input type="password" placeholder="" onChange={(ev)=>setConfirmpass(ev.target.value)} required/>
                <div className="account">
                <label>Already have an account? </label>
                <button className="signin" onClick={handlesignin}>Sign In</button>
                </div>
                <input type="submit" value="submit"/>
            </form>
            <p>By clicking the signup button ,you agree to<br/>
                 our <a href="#">Terms and Conditions</a> and <a href="#">Policies</a></p>
        </div>
        </div>
          
    )
}
