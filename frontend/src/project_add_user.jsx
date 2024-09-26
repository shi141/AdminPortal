import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// interface SimpleDialogProps{
//     open: boolean;
//     setOpen: React.Dispatch<React.SetStateAction<boolean>>;
// }

export default function Dialog1({open,data,setdialog,setData}){

const [name,setName]=useState('');
const [amount,setAmount]=useState();
const [cost,setCost]=useState();
const [start_date,set_start_date]=useState(new Date());
const [end_date,set_end_date]=useState(new Date());
const [created_by,set_created_by]=useState('');
const onClose=()=>{
    setdialog(false);
}
const handleSubmit=async(e)=>{
    const projectData=[...data];
    e.preventDefault();
    const newdata ={"name":name,"amount":amount,"cost":cost,"start_date":start_date,"end_date":end_date};
    // setData([...data,newdata])
    // alert(data);
    alert(newdata);
    const token=localStorage.getItem("access_token");
    const response=await fetch(`http://127.0.0.1:800/add_project`,{
        method:'POST',
        headers:{
            'Content-Type':'application/json',
            'Authorization':`Bearer ${token}`
        },
        body: JSON.stringify(newdata)
    })
    if(response.ok){
        const data =await response.json()
        
        projectData.splice(projectData.length,0,data);
        setData(projectData);
        setdialog(false);
    }
    onClose();
}
    return(
        <Dialog  open={open} maxWidth="lg" fullWidth>
      <DialogTitle align='center'>Project Detail</DialogTitle>
      <DialogContent>
      <form onSubmit={handleSubmit} className="form" method="post">
            <div className="input-box">
                <label htmlFor='name'>Project Name</label>
                <input type="text" id="name" name="name" onChange={(e)=>setName(e.target.value)} placeholder="Enter Project Name" required/>
            </div>
            <div className="input-box">
                <label htmlFor="amount">Amount</label>
                <input type="text" id="amount" onChange={(e)=>setAmount(e.target.value)} name="amount" placeholder="Enter Amount" required/>
            </div>
            <div className="input-box">
                <label htmlFor="cost">Cost</label>
                <input type="text" id="cost" onChange={(e)=>setCost(e.target.value)} name="cost" placeholder="Enter Cost" required/>
            </div>
            <div className="column">
                <div className="input-box">
                    
                    <DatePicker label="Start Date" selected={start_date} onChange={(start_date)=>set_start_date(start_date)}/>
                </div>
                <div className="input-box">
                    <label htmlFor="end_date">End date</label>
                    <DatePicker selected={end_date} onChange={(end_date)=>set_end_date(end_date)}/>
                </div>
            </div>

            <button type="submit" >Submit Details</button>
            <Button onClick={() => onClose()}>Cancel</Button>
        </form>

      </DialogContent>
        
     
    </Dialog>
    )
}