import React from "react";
import DatePicker from 'react-datepicker';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import { useState } from "react";


export default function Dialog_add_project({ open, setdialog, setProject, project, onClose,id,data,setData,project_amount,progress_amount}) {
    const [progress_date, set_progress_date] = useState(new Date());
    const [amount, setAmount] = useState('');
    const[amountCompleted,setAmountCompleted]=useState([])
    const[progressId,setProgressId]=useState([])

    const handleSubmit = async(event) => {
        event.preventDefault();  // Prevent page reload
        const projectAmount=project_amount;
        const progressAmount=progress_amount;
        console.log(projectAmount);
        console.log(progressAmount);
        const remainingAmount=projectAmount-progressAmount;
        console.log(remainingAmount);
        if(amount!='' && amount<=remainingAmount ){
           
        
        const dictionary={'project_id':id,'progress_date':progress_date,'amount_completed':amount}
        const token=localStorage.getItem("access_token");
        const response=await fetch(`http://127.0.0.1:800/add_progress`,{
            method:['POST'],
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,  // Include JWT token in the Authorization header
            },
            body:JSON.stringify(dictionary)
        })
        const arr=[...data];
        // console.log(projectData);
        if (response){
            const updated=await response.json();
            const index=arr.findIndex(i=>i.id===id);
            console.log(index);
            console.log(arr);
            console.log(updated)
                if(index>=-1){
                  arr.splice(index,1,updated);
                  console.log("hello");
                  console.log(arr);
                  setData(arr);
                  onClose();
                }
        // onClose();  // Close the dialog after submission
    }
}
else{
    onClose();
}
};

    return (
        <Dialog 
            open={open} 
            onClose={onClose} 
            sx={{ '& .MuiDialog-paper': { width: "60%", maxWidth: "none" } }} 
            fullWidth
        > 
            <form className="form" method="post">
                <DialogTitle>Add Project Progress</DialogTitle>
                <DialogContent sx={{ overflowX: 'hidden' }}>
                    <div className="input-box" style={{ marginBottom: '16px', width: '100%' }}>
                        <label htmlFor='name'>Progress Date</label>
                        <DatePicker 
                            selected={progress_date} 
                            onChange={(date) => set_progress_date(date)} 
                            required
                            style={{ width: "100%" }}  // Make the date picker responsive
                        />
                    </div>
                    <div className="input-box" style={{ marginBottom: '16px', width: '100%' }}>
                        <label htmlFor="amount">Amount Completed</label>
                        <input 
                            type="text" 
                            id="amount" 
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            name="amount"  
                            required
                            placeholder="Enter Amount Completed"
                            style={{ width: "100%" }}  // Ensure input takes full width
                            
                        />
                    </div>
                </DialogContent>
                <DialogActions>
                <Button type="submit" onClick={handleSubmit} variant="contained">Submit</Button>
                    <Button onClick={onClose}>Cancel</Button>
                    
                </DialogActions>
            </form>
        </Dialog>
    );
}
