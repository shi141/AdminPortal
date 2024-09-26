import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import '/src/styles/edit.css';


interface Simple1Dialog1Props{
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    
}

export default function Simple1Dialog1({open,user,data,setdata,onSubmit,setdialog}) {

    const id=user.id;
    const  [name,setName]=useState(user.name);
    const  [email,setEmail]=useState(user.email);
    const  [numb,setNumb]=useState(user.contact);
    const  [department,setDepartment]=useState(user.department);
    const  [role,setRole]=useState(user.role);
    
    
          
      const updateduser={
        id,
        name,
        email,
        department,
        role,
        contact:numb,
      }
    
      const handleSubmit = async (event) => {
        event.preventDefault();
        // try {
          const token=localStorage.getItem("access_token");
            const response = await fetch(`http://127.0.0.1:800/edit_user/${id}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, 
              },
              body: JSON.stringify(updateduser)
            });
            // const neww=JSON.stringify(updateduser)
            
        
            if (response.ok) {

              const arr=[...data];
              console.log(arr);
              const updated=await response.json();
              // const updated=JSON.stringify(result)
              if(updated){
                const index=arr.findIndex(i=>i.id===id);
                if(index>=-1){
                  arr.splice(index,1,updated);
                  setdata(arr);
                  confirm("User Details Updated");
                  setdialog(false);
                  
                  
                }
              }
              }


      };
      const onClose=()=>{
        setdialog(false);
      }
      return (
        // <Dialog onClose={handleClose} open={open} maxWidth="lg" fullWidth>
        <div className='main_edit'>
          <div className='dialog_Edit'>
      <Dialog open={open} sx={{ '& .MuiDialog-paper': { width: "50%",height:"1000px", maxWidth: "none",marginTop:"0%",overflow:"hidden" } }}
       slotProps={{
        backdrop: {
          sx: { backgroundColor: 'transparent' } 
        }
      }}
      fullWidth>
      <DialogTitle align='center' >User Detail</DialogTitle>
      <DialogContent>

      <form  className="form" method="post" style={{height:"500px"}}>

      <TextField label="ID" name="id" value={id} aria-readonly sx={{fontSize:"20px"}}   />
            <div className="input-box">
                <label htmlFor='name'>Full Name</label>
                {/* <TextField label="ID" name="id" value="name" aria-readonly   /> */}
                <input type="text" id="name" name="name"  value={name} onChange={(e) => setName(e.target.value)}  placeholder="Enter Full Name" required/>
            </div>
            <div className="input-box">
                <label htmlFor="email">E-Mail</label>
                {/* <TextField label="ID" name="id" value="email" aria-readonly   /> */}
                <input type="text" id="email"  value={email} onChange={(e) => setEmail(e.target.value)} name="email"  placeholder="Enter E-Mail" required/>
            </div>
            <div className="input-box">
                <label htmlFor="numb">Contact Number</label>
                {/* <TextField label="ID" name="id" value="numb" aria-readonly   /> */}
                <input type="text" id="numb" value={numb} onChange={(e) => setNumb(e.target.value)}  name="numb"  placeholder="Enter Contact Number" required/>
            </div>
            <div className="column">
                <div className="input-box">
                    <label htmlFor="department">Department</label>
                    {/* <TextField label="ID" name="id" value="department" aria-readonly   /> */}
                    <input type="text"  id="department" value={department} onChange={(e) => setDepartment(e.target.value)}  name="department" placeholder="Enter department name" required/>
                </div>
                <div className="input-box">
                    <label htmlFor="role">Role</label>
                    {/* <TextField label="ID" name="id" value="role" aria-readonly   /> */}
                    <input type="text"  name="role" value={role} onChange={(e) => setRole(e.target.value)} id="role"  placeholder="Enter user role" />
                </div>
            </div>
            <Button variant="contained" color="primary" onClick={handleSubmit} sx={{marginBottom:"0%",padding:"0%"}}  >Update</Button>
            <Button onClick={() => onClose()} sx={{marginTop:"0%",padding:"0%"}}>Cancel</Button>
        
        </form>

      </DialogContent>
        
     
    </Dialog>
    </div>
    </div>
  );
}