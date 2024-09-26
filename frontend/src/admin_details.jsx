import Sidebar from "./components/sidebar";
import React from "react";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { useEffect,useState } from "react";
import Dialog1 from './project_add_user.jsx';
import Dialog_add_project from "./add_project.jsx";
import Progress_detail from "./progress_detail.jsx";
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import './styles/admin_details.css';

export default function Admin_details(){
    const [login,setLogin]=useState([]);
useEffect(()=>{
    const fetchData=async()=>{
        const response=await fetch (`http://127.0.0.1:800/admin`,{
            method:'GET',
            headers:{
                "content-type":"application/json",
            }
        })
        if(response.ok){
            const data=await response.json()
            console.log(data);
            setLogin(data);
        }
    };
    fetchData();
},[]);


    return(
        <div className="main">
            <Sidebar/>
            <div className="content_admin_details">
                <div className="heading_admin_details" ><h1>Authorised Login</h1></div>
                <div className="admin">
                <TableContainer component={Paper} sx={{marginTop:"2%",border:"1px solid grey",width:"97%",marginLeft:"auto",marginRight:"auto"}}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                        <TableRow>
                            <TableCell>LOGIN ID</TableCell>
                            <TableCell>NAME</TableCell>
                            <TableCell>POSITION</TableCell>
                            <TableCell>PROJECT ID</TableCell>
                            <TableCell>PROJECT NAME</TableCell>
                            <TableCell>DATE CREATED</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                            {login.map((item,index)=>(
                                <TableRow key={index}>
                                    <TableCell>{item.id}</TableCell>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell>{item.role}</TableCell>
                                    <TableCell>{item.project_id}</TableCell>
                                    {/* <TableCell><a href="#"></a>{item.project}</TableCell> */}
                                    <TableCell><Link to={`/project_page/${item.project_id}`}>{item.project}</Link></TableCell>
                                    <TableCell>{item.date}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                </div>
            </div>
        </div>
    )
}