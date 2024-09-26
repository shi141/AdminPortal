import React, { useState, useEffect } from "react";
import {getdataa} from '../src/new.ts';
import './styles/loginpage.css';
import { useSelector,useDispatch } from 'react-redux';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import SimpleDialog from './components/dialog.tsx';
import { IoIosSearch } from "react-icons/io";
import Simple1Dialog1 from './components/edit.tsx';
import ViewUpload from "./view_uploads.tsx";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import styled from 'styled-components';
import { deepOrange, green } from '@mui/material/colors';
import { useNavigate } from 'react-router-dom';
import bcryptjs from 'bcryptjs';
import { Padding } from '@mui/icons-material';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from "./components/sidebar.jsx";
import { MdEdit,MdUploadFile } from "react-icons/md";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { TiArrowSortedDown,TiArrowSortedUp } from "react-icons/ti";
import { TablePagination } from "@mui/material";
import { Link } from "react-router-dom";


export default function Login(){
  const navigate=useNavigate();
  const [data, setData] = useState([]);
  const[openDialog1,setOpenDialog1] = useState(false);
  const[openDialog2,setOpenDialog2] = useState(false);
  const[selectedUser,setSelectedUser]=useState(null);
  const[selectedData,setSelectedData]=useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [file,SetFile]=useState(null);

  const [page,setPage]=useState(0);
  const [rowsPerPage,setrowsPerPage]=useState(4);
  const paginatedData = data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const username = useSelector((state) => state.username);
  
  // useEffect(() => {
  //   const alertShown = localStorage.getItem('welcomeAlertShown');
  //   if (alertShown && username) {
  //     alert(`Welcome ${username}`);
  //     localStorage.setItem('welcomeAlertShown', 'false');
  //   }
  // }, [username]);
  const handleDelete = async (id,data) => {
    if(confirm("Are you sure you want to delete ?")){
      const new_arr=[...data];
      const index=new_arr.findIndex(i=>i.id===id);
      const token = localStorage.getItem('access_token');
      const response = await fetch(`http://127.0.0.1:800/delete_user/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,  // Include JWT token in the Authorization header
        }
      });
      if (response.ok) {
        const result = await response.json();
        new_arr.splice(index,1);
        setData(new_arr);
        // if (result){
        //   alert("user deleted succesfully");
        // }
        alert("user deleted succesfully");
        // window.location.reload(); // Alert success message
      } else {
        alert('Not authorised');
      }
    }
    else{
      console.log('deletion cancelled');
    }
  }


  const handleEditClick = (item,data) => {
    
        setSelectedData(data);
        setSelectedUser(item);// Store the user object for editing
        
        setOpenDialog2(true); // Open edit dialog
      };
      
    const handleAddUser=()=>{
      setOpenDialog1(true);
      setData(data);
      setDataLoaded(true);
    }
  useEffect(() => {
        const fetchdata=async()=>{
          const fetcheddata=await getdataa();
          setData(fetcheddata);
        };
    
        fetchdata();
      }, []);

    const Backtologin=()=>{
      if (confirm("Are you sure you want to logout?")){
        navigate('/');
      }
      else{
        console.log('');
      }
    }
    const addfilefunction=async(file)=>{
      
      const formdata=new FormData
      formdata.append("file", file);
      const response=await fetch(`http://127.0.0.1:800/add_file`,{
        method:['POST'],
        body:formdata,
        
      })
      if (response.ok) {
        const data = await response.json();
        alert('File uploaded successfully: ' + data.message);
      } else {
        alert('File upload failed.');
      }
    } 
    const FileIcon = ({ fileType }) => {
      if (fileType.includes('pdf')) return <i className="fa fa-file-pdf" style={{ fontSize: '48px', color: 'red' }}></i>;
      if (fileType.includes('txt')) return <i className="fa fa-file-alt" style={{ fontSize: '48px', color: 'gray' }}></i>;
      if (fileType.includes('image')) return <i className="fa fa-file-image" style={{ fontSize: '48px', color: 'blue' }}></i>;
      return <i className="fa fa-file" style={{ fontSize: '48px', color: 'green' }}></i>;
    };

    const [sortedData,setSortedData]=useState("asc");
    const handleAddFile=(event)=>{
      const fileUpload=event.target.files[0]
      SetFile(fileUpload);
      // addfilefunction(fileUpload);
    }
    const [files, setFiles] = useState([]);
    const handleUploads=async ()=>{
      const response=await fetch(`http://127.0.0.1:800/view_uploads`,{
        method:['GET']
      })
      const data= await response.json();
      setFiles(data);
    }
  
    const handleproject=()=>{
      navigate('/projectdetails');
    }

  const sortId=()=>{
    let SortedDataId;
    if(sortedData==="asc"){
      SortedDataId=[...data].sort((a,b)=>a.id-b.id);
      setSortedData("dsc");
    }
    else{
      SortedDataId=[...data].sort((a,b)=>b.id-a.id);
      setSortedData("asc");
    }
    setData(SortedDataId);
  }

  const sortName=()=>{
    let sortedDataName;
    if(sortedData==="asc"){
      sortedDataName=[...data].sort((a,b)=>a.name.localeCompare(b.name));
      setSortedData("dsc");
    }
    else{
      sortedDataName=[...data].sort((a,b)=>b.name.localeCompare(a.name));
      setSortedData("asc");
    }
    setData(sortedDataName);
  }
  const sortRole=()=>{
    let sortedDataRole;
    if(sortedData==="asc"){
      sortedDataRole=[...data].sort((a,b)=>a.role.localeCompare(b.role));
      setSortedData("dsc");
    }
    else{
      sortedDataRole=[...data].sort((a,b)=>b.role.localeCompare(a.role));
      setSortedData("asc");
    }
    setData(sortedDataRole);
  }
  const sortDepartment=()=>{
    let sortedDataDepartment;
    if(sortedData==="asc"){
      sortedDataDepartment=[...data].sort((a,b)=>a.department.localeCompare(b.department));
      setSortedData("dsc");
    }
    else{
      sortedDataDepartment=[...data].sort((a,b)=>b.department.localeCompare(a.department));
      setSortedData("asc");
    }
    setData(sortedDataDepartment);
  }
  const sortEmail=()=>{
    let sortedDataEmail;
    if(sortedData==="asc"){
      sortedDataEmail=[...data].sort((a,b)=>a.email.localeCompare(b.email));
      setSortedData("dsc");
    }
    else{
      sortedDataEmail=[...data].sort((a,b)=>b.email.localeCompare(a.email));
      setSortedData("asc");
    }
    setData(sortedDataEmail);
  }
  const sortContact=()=>{
    let sortedDataContact;
    if(sortedData==="asc"){
      sortedDataContact=[...data].sort((a,b)=>a.contact-b.contact);
      setSortedData("dsc");
    }
    else{
      sortedDataContact=[...data].sort((a,b)=>b.contact-a.contact);
      setSortedData("asc");
    }
    setData(sortedDataContact);
  }
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setrowsPerPage(parseInt(event.target.value, 10));
    setPage(0); 
  };
    const [query,setQuery]=useState('');
    console.log(query);
  return(
          <div className="dashboard">
            <Sidebar/>
             <div className="dashboard--content">
              <div className="breadcrumbs">
                <ul className="ulist">
                  <Link to={"/home_page"} classname="cursor-pointer hover:bg-[#E8DAEF] p-4 rounded-md">
                  Home <span> /</span>
                  </Link>
                  <Link to={"/user_access"} classname="cursor-pointer hover:bg-[#E8DAEF] p-4 rounded-md">
                  User Details<span> /</span>
                  </Link>
                </ul>
              </div>
              <div className="Topbuttons" style={{marginTop:"0%"}}  >
              <div style={{marginBottom:"2%",marginLeft:"0%",marginTop:"0%"}}
               className="controls" >
                 <input type="text" placeholder=" Filter items"  
                 onChange={(e)=>setQuery(e.target.value)} 
                 style={{marginTop:"8%" ,height:"30px",width:"240px"}}/></div>
                 <div className="heading" style={{margin:"0",padding:"0"}}>
                <h1>USER MANAGEMENT</h1>
                </div>
                <div className="button" style={{marginTop:"2%"}} >
          <Button
            onClick={() => handleAddUser()}
            variant="contained"
            sx={{ bgcolor: deepOrange,height:"45px",width:"150px", fontSize: "15px" }}
          >
            + New User
          </Button>
          <Button
            variant="contained"
            onClick={handleUploads}
            sx={{ bgcolor: deepOrange,height:"45px",width:"150px", fontSize: "15px" }}
          >
            View uploads
          </Button>
        </div>
         </div >
         
         {openDialog1 && dataLoaded && <SimpleDialog open={openDialog1} data={data} setdata={setData} setdialog={setOpenDialog1}  />}
         
         <div className="content" style={{width:"100%",height:"500px",marginTop:"0"}}>
             <TableContainer component={Paper} sx={{ border:"1px solid grey",height:"440px" ,width:"100%"}} >
             <Table  aria-label="simple table">
               <TableHead sx={{height:"65px"}}>
                 <TableRow sx={{height:"85px",backgroundColor:"lightgrey",borderBottom:"solid 1px black"}}>
                   <TableCell >ID{sortedData==="asc"?(<TiArrowSortedDown style={{cursor:"pointer"}} onClick={sortId}/>)
                   :(<TiArrowSortedUp style={{cursor:"pointer"}} onClick={sortId}/>)}</TableCell>
                   <TableCell >NAME {sortedData==="asc"?(<TiArrowSortedDown style={{cursor:"pointer"}} onClick={sortName}/>)
                   :(<TiArrowSortedUp style={{cursor:"pointer"}} onClick={sortName}/>)}</TableCell>
                   <TableCell >DEPARTMENT{sortedData==="asc"?(<TiArrowSortedDown style={{cursor:"pointer"}} onClick={sortDepartment}/>)
                   :(<TiArrowSortedUp style={{cursor:"pointer"}} onClick={sortDepartment}/>)}</TableCell>
                   <TableCell >EMAIL{sortedData==="asc"?(<TiArrowSortedDown style={{cursor:"pointer"}} onClick={sortEmail}/>)
                   :(<TiArrowSortedUp style={{cursor:"pointer"}} onClick={sortEmail}/>)}</TableCell>
                   <TableCell >ROLE{sortedData==="asc"?(<TiArrowSortedDown style={{cursor:"pointer"}} onClick={sortRole}/>)
                   :(<TiArrowSortedUp style={{cursor:"pointer"}} onClick={sortRole}/>)}</TableCell>
                   <TableCell >CONTACT{sortedData==="asc"?(<TiArrowSortedDown style={{cursor:"pointer"}} onClick={sortContact}/>)
                   :(<TiArrowSortedUp style={{cursor:"pointer"}} onClick={sortContact}/>)}</TableCell>
                   <TableCell ></TableCell>
                   <TableCell ></TableCell>
                   <TableCell ></TableCell>
                 </TableRow>
               </TableHead>
              <TableBody>
  {paginatedData.filter((item) => {
    if (query.toLowerCase() === '') {
      return item;
    } else if (
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.role.toLowerCase().includes(query.toLowerCase()) ||
      item.department.toLowerCase().includes(query.toLowerCase()) ||
      item.email.toLowerCase().includes(query.toLowerCase()) ||
      String(item.id).toLowerCase().includes(query.toLowerCase()) ||
      String(item.contact).toLowerCase().includes(query.toLowerCase())
    ) {
      return item;
    }
    return false;
  }).length > 0 ? (
    paginatedData
      .filter((item) => {
        return query.toLowerCase() === ''
          ? item
          : item.name.toLowerCase().includes(query.toLowerCase()) ||
            item.role.toLowerCase().includes(query.toLowerCase()) ||
            item.department.toLowerCase().includes(query.toLowerCase()) ||
            item.email.toLowerCase().includes(query.toLowerCase()) ||
            String(item.id).toLowerCase().includes(query.toLowerCase()) ||
            String(item.contact).toLowerCase().includes(query.toLowerCase());
      })
      .map((item, index) => (
        <TableRow
          sx={{ height: '85px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
          key={index}
        >
          <TableCell
            sx={{ height: '50px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
          >
            {item.id}
          </TableCell>
          <TableCell
            sx={{ height: '50px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
          >
            {item.name}
          </TableCell>
          <TableCell
            sx={{ height: '50px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
          >
            {item.department}
          </TableCell>
          <TableCell
            sx={{ height: '50px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
          >
            {item.email}
          </TableCell>
          <TableCell
            sx={{ height: '50px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
          >
            {item.role}
          </TableCell>
          <TableCell
            sx={{ height: '50px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
          >
            {item.contact}
          </TableCell>
          <TableCell>
            <Button onClick={() => handleEditClick(item, data)} variant="text" sx={{ color: 'green' }}>
              <MdEdit size={20} />
            </Button>
          </TableCell>
        
        {openDialog2 && (
          <Simple1Dialog1
            open={openDialog2}
            user={selectedUser}
            data={selectedData}
            setdata={setData}
            setdialog={setOpenDialog2}
            BackdropProps={{
              style: { backgroundColor: 'rgba(0, 0, 0, 0.5)' } 
            }}
          />
        )}
    <TableCell><Button onClick={()=>handleDelete(item.id,data)} variant="text" sx={{color:"	brown",height:"20px"}} ><RiDeleteBin5Fill size={20}/></Button>
    
    </TableCell>
    <TableCell sx={{width:"20px"}}>
    <input type="file" style={{width:"187px"}} name="fileuploaded" onChange={handleAddFile}/>
    <Button onClick={()=>{addfilefunction(file)}}><MdUploadFile size={20}/></Button>
    </TableCell>
  </TableRow>)))
      
        : (
    <TableRow>
      <TableCell colSpan={9} align="center">
        No matching records found
      </TableCell>
    </TableRow>
  )}
</TableBody>

            </Table>
            </TableContainer>

            
        
        {/* <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: '20px' }}>
        {files.map((file, index) => (
          <div
            key={index}
            style={{
              width: '100%',
               margin: '10px',
               textAlign: 'center',
               cursor: 'pointer',
               border: '2px solid black',
              padding: '10px',
               borderRadius: '8px',
             }}
             onClick={() => openFile(file)} 
           >
             <FileIcon fileType={file} />  
             <p>{file}</p>  
           </div>
         ))}
       </div> */}
       </div>
       <div className="table_pagination" style={{height:"60px",marginBottom:"0%"}}>
       <TablePagination
            component="div"
            count={data.length} 
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[4, 8, 12]} 
          style={{marginTop:"0%",marginBottom:"3%",position:"absolute",marginLeft:"49%"}}/>
        </div>
       </div>
    </div>
    
    )
}
