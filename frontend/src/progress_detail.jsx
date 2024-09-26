
import React from "react";
import { useEffect, useState } from "react";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Dialog, DialogActions, Button } from '@mui/material';

export default function Progress_detail({ open, setdialog, id }) {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchdata = async () => {
            if (id) {
                const project_id = id;
                console.log(project_id);
                const token = localStorage.getItem('access_token');
                const response = await fetch(`http://127.0.0.1:800/progress_details/${project_id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,  // Include JWT token in the Authorization header
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    console.log(data);
                    setData(data);
                }
            }
        };
        fetchdata();
    }, [id]);

    const onClose = () => {
        setdialog(false);
    }

    return (
        <Dialog 
            open={open} 
            onClose={onClose} 
            sx={{ '& .MuiDialog-paper': { width: "60%", maxWidth: "none" } }} 
            fullWidth
        > 
            <TableContainer component={Paper} sx={{ marginTop: "2%" }}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>PROGRESS ID</TableCell>
                            <TableCell>PROJECT DATE</TableCell>
                            <TableCell>AMOUNT</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell>{item.progress_id}</TableCell>
                                <TableCell>{item.progress_date}</TableCell>
                                <TableCell>{item.amount_completed}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <DialogActions>
                <Button onClick={onClose} variant="contained">Cancel</Button>
            </DialogActions>
        </Dialog>
    );
}
