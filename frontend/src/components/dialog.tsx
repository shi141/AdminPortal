import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import PersonIcon from '@mui/icons-material/Person';
import AddIcon from '@mui/icons-material/Add';
import Typography from '@mui/material/Typography';
import "../styles/dialog.css"
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';


interface SimpleDialogProps{
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function SimpleDialog({open,data,setdata,setdialog}) {
  const [FormData, setFormData] = useState({
    name: '',
    email:'',
    department: '',
    numb:'',
    role:'',
});
const onClose = () => {
  setdialog(false);
};
const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setFormData({
        ...FormData,
        [name]: value,
    });
};


const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault(); // Prevent the default form submission
  const token=localStorage.getItem("access_token");
  try {
    const response = await fetch('http://127.0.0.1:800/add_user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization':`Bearer ${token}`
      },
      body: JSON.stringify(FormData)
    });
    if (response.ok) {
      const arr=[...data];
      const result = await response.json();
      if (result){
        arr.splice(arr.length,0,result);
        setdata(arr);
        confirm('User Added');
        setdialog(false);
      }
    } else {
      alert('Failed to add user');
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

  return (
    <Dialog  open={open} sx={{ '& .MuiDialog-paper': { width: "60%", maxWidth: "none" } }} 
            fullWidth>
      <DialogTitle align='center'>User Detail</DialogTitle>
      <DialogContent>
      <form onSubmit={handleSubmit} className="form" method="post">
            <div className="input-box">
                <label htmlFor='name'>Full Name</label>
                <input type="text" id="name" name="name" value={FormData.name} onChange={handleChange} placeholder="Enter Full Name" required/>
            </div>
            <div className="input-box">
                <label htmlFor="email">E-Mail</label>
                <input type="text" id="email" value={FormData.email} onChange={handleChange} name="email" placeholder="Enter E-Mail" required/>
            </div>
            <div className="input-box">
                <label htmlFor="numb">Contact Number</label>
                <input type="text" id="numb" value={FormData.numb} onChange={handleChange} name="numb" placeholder="Enter Contact Number" required/>
            </div>
            <div className="column">
                <div className="input-box">
                    <label htmlFor="department">Department</label>
                    <input type="text" value={FormData.department} onChange={handleChange} id="department" name="department" placeholder="Enter department name" required/>
                </div>
                <div className="input-box">
                    <label htmlFor="role">Role</label>
                    <input type="text" value={FormData.role} onChange={handleChange} name="role" id="role" placeholder="Enter user role" />
                </div>
            </div>

            <button type="submit" >SUBMIT</button>
            <Button onClick={() => onClose()}>Cancel</Button>
        </form>

      </DialogContent>
        
     
    </Dialog>
  );
}
