
import React, { useEffect } from "react";
import { useState } from "react";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

export default function UploadCsv(){
    const [file,setFile]=useState([]);
    const [data,setData]=useState([]);

    const handleOnChange=(event)=>{
        setFile(event.target.files[0])
    }

    useEffect(()=>{
        const read_csv_data=async()=>{
            const token=localStorage.getItem("access_token");
            console.log(token);
            const fetchedData=await fetch(`http://127.0.0.1:800/read_csv_data`,{
                method:'GET',
                headers:{
                    'Content-Type': 'application/json',
                    "Authorization":`Bearer ${token}`,
                }
            })
            const data=await fetchedData.json();
            console.log(data);
            setData(data);
        }
        read_csv_data();
    },[]);

    
    const handleUpload=async()=>{
        const formdata=new FormData;
        formdata.append("file",file);
        const token=localStorage.getItem("access_token");
        const response=await fetch(`http://127.0.0.1:800/upload_csv`,{
            method:['POST'],
            body:formdata,
            headers:{
                "Authorization":`Bearer ${token}`
            }
        })
        if(response.ok){
            const data=await response.json();
            console.log(data);
            
        }

    }
    return(
        <div className="main">
            <div className="mainContainer">
                <div className="uploadFile">
                <h2>Select a csv file : <input type="file" accept=".csv" onChange={handleOnChange}/> </h2>
                <button style={{backgroundColor:"rgb(64, 118, 218)",height:"50px",width:"150px",color:"white",fontSize:"20px"}} onClick={()=>{handleUpload()}}>
                    Upload</button>
                </div>
                <div className="readFile">
                
                <TableContainer component={Paper} sx={{marginTop:"2%",border:"1px solid grey",width:"97%",marginLeft:"auto",marginRight:"auto"}}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                        <TableRow>
                            <TableCell>STUDENT ID</TableCell>
                            <TableCell>MATHEMATICS</TableCell>
                            <TableCell>SCIENCE</TableCell>
                            <TableCell>SOCIAL SCIENCE</TableCell>
                            <TableCell>ENGLISH</TableCell>
                            <TableCell>THIRD LANGUAGE</TableCell>
                            <TableCell>WELLNESS</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.map((item,index)=>(
                                <TableRow key={index}>
                                    <TableCell>{item.student_ID}</TableCell>
                                    <TableCell>{item.s_101}</TableCell>
                                    <TableCell>{item.s_102}</TableCell>
                                    <TableCell>{item.s_103}</TableCell>
                                    <TableCell>{item.s_104}</TableCell>
                                    <TableCell>{item.s_105}</TableCell>
                                    <TableCell>{item.s_106}</TableCell>
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