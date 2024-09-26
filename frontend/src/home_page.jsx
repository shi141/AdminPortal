import React, { useState } from "react";
import Sidebar from "./components/sidebar.jsx";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

import './styles/home_page.css';

export default function Home_page(){
    const [data,setData]=useState([]);

    useEffect(()=>{
        const fetchData=async()=>{
            const token=localStorage.getItem('access_token');
            const response=await fetch (`http://127.0.0.1:800/homepage`,{
                method:"GET",
                headers:{
                    "content-type":"application/json",
                    'Authorization': `Bearer ${token}`,
                }
            })
            if (response.ok){
                const data=await response.json()
                setData(data);
            }
        }
        fetchData();
    },[])

    return(
        <div className="dashboard">
            <Sidebar/>
            <div className="dashboard--content">
                {/* <p>home page</p> */}
                <div className="container_3">
                <div className="container_home1">
                    <p>Number of Admins :<br/>{data.admin}</p>
                </div>
                <div className="container_home1">
                <p>Number of project :<br/>{data.project}</p>
                </div>
                <div className="container_home1">
                <p>Number of users : <br/>{data.user}</p>
                </div>
                </div>
                <div className="horizontal_container_home">
                    <p>horizontal container</p>
                </div>
            </div>
        </div>
    )
}
