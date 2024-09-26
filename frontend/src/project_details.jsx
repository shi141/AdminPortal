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
import './styles/project_details.css';
import Sidebar from "./components/sidebar.jsx";
import TablePagination from '@mui/material/TablePagination';
import { TiArrowSortedDown,TiArrowSortedUp } from "react-icons/ti";

export default function Project_details(){
  const [data, setData] = useState([]);
  const navigate=useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const [openDialogAddProgress, setOpenDialogProgress] = useState(false); 
  const [project, setProject] = useState([]);
  const[projectId,setProjectId]=useState([]);
  const[progressId,setProgressId]=useState(null);
  const [openProgress,setOpenProgress]=useState(false);
  const [project_amount,setProjectAmount]=useState(null);
  const[progress_amount,setProgressAmount]=useState(null);

  const [page, setPage] = useState(0); // Track current page (zero-indexed)
  const [rowsPerPage, setRowsPerPage] = useState(4); // Rows per page

    useEffect(() => {
        const fetchdata=async()=>{
            const token=localStorage.getItem('access_token');
          const response=await fetch(`http://127.0.0.1:800/project_details`,{
            method:['GET'],
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,  // Include JWT token in the Authorization header
            }})
            if (response.ok){
                const data=await response.json() ;
                setData(data);
                
            }
        };
        fetchdata();
      }, []);
      
      const handleproject=(data)=>{
        setData(data);
        setOpenDialog(true);
        console.log(data);
      }

      const handle_add_progress = (project,id,amount,progressAmount) => {
        setProject(project);
        setProjectId(id);
        setProjectAmount(amount);
        setProgressAmount(progressAmount);
        setOpenDialogProgress(true); // Open the dialog only when the button is clicked
    };
      const handleCloseDialog = () => {
        setOpenDialog(false);
      };
      const handleCloseProgressDialog = () => {
        setOpenDialogProgress(false); // Ensure you can close the Add Progress dialog
    };
    
    const handle_progress_detail=(project_id)=>{
      setProgressId(project_id);
      console.log(progressId);
      setOpenProgress(true);
    }

    const project_page=(id)=>{
      navigate(`/project_page/${id}`);
    }
    const handleback=()=>{
      navigate('/user_access')
    }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); 
  };

  const paginatedData = data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const [search,setSearch]=useState("");
  const [sortData,setSortData]=useState("asc");
  // const [IconAsc,setIcon]=useState(<TiArrowSortedDown/>)
  const sortAmount=()=>{
    let sortedDataAmount;
    if (sortData === "asc") {
      sortedDataAmount = [...data].sort((a, b) => a.amount - b.amount);
      setSortData("desc");
    } else {
      sortedDataAmount = [...data].sort((a, b) => b.amount - a.amount);
      setSortData("asc");
    }
    setData(sortedDataAmount);

  }
  const sortId=()=>{
    let sortedDataId;
    if (sortData === "asc") {
      sortedDataId = [...data].sort((a, b) => a.id - b.id);
      setSortData("desc");
    } else {
      sortedDataId = [...data].sort((a, b) => b.id - a.id);
      setSortData("asc");
    }
    setData(sortedDataId);

  }
  const sortName=()=>{
    let sortedDataName;
    if (sortData === "asc") {
      sortedDataName = [...data].sort((a, b) => a.name.localeCompare(b.name));
      setSortData("desc");
    } else {
      sortedDataName = [...data].sort((a, b) => b.name.localeCompare(a.name));
      setSortData("asc");
    }
    setData(sortedDataName);

  }
  const sortCost=()=>{
    let sortedDataCost;
    if (sortData === "asc") {
      sortedDataCost = [...data].sort((a, b) => a.cost - b.cost);
      setSortData("desc");
    } else {
      sortedDataCost = [...data].sort((a, b) => b.cost - a.cost);
      setSortData("asc");
    }
    setData(sortedDataCost);

  }
  const sortStartDate=()=>{
    let sortedDataStartDate;
    if (sortData === "asc") {
      sortedDataStartDate = [...data].sort((a, b) => a.start_date.localeCompare(b.start_date)) ;
      setSortData("desc");
    } else {
      sortedDataStartDate = [...data].sort((a, b) => b.start_date.localeCompare(a.start_date));
      setSortData("asc");
    }
    setData(sortedDataStartDate);
    data.forEach(item => {
      console.log(typeof(item.start_date));
    });

  }
  const sortEndDate=()=>{
    let sortedDataEndDate;
    if (sortData === "asc") {
      sortedDataEndDate = [...data].sort((a, b) => a.end_date.localeCompare(b.end_date));
      setSortData("desc");
    } else {
      sortedDataEndDate = [...data].sort((a, b) => b.end_date.localeCompare(a.end_date));
      setSortData("asc");
    }
    setData(sortedDataEndDate);

  }
  const sortCreatedBy=()=>{
    let sortedDataCreatedBy;
    if (sortData === "asc") {
      sortedDataCreatedBy = [...data].sort((a, b) => a.created_by.localeCompare(b.created_by));
      setSortData("desc");
    } else {
      sortedDataCreatedBy = [...data].sort((a, b) => b.created_by.localeCompare(a.created_by));
      setSortData("asc");
    }
    setData(sortedDataCreatedBy);

  }
  const sortProgressPercentage=()=>{
    let sortedDataPercentage;
    if (sortData === "asc") {
      sortedDataPercentage = [...data].sort((a, b) => a.progress_percentage.localeCompare(b.progress_percentage));
      setSortData("desc");
    } else {
      sortedDataPercentage = [...data].sort((a, b) => b.progress_percentage.localeCompare(a.progress_percentage));
      setSortData("asc");
    }
    setData(sortedDataPercentage);

  }
  const sortProgressAmount=()=>{
    let sortedDataProgressAmount;
    if (sortData === "asc") {
      sortedDataProgressAmount = [...data].sort((a, b) => a.progress_amount - b.progress_amount);
      setSortData("desc");
    } else {
      sortedDataProgressAmount = [...data].sort((a, b) => b.progress_amount - a.progress_amount);
      setSortData("asc");
    }
    setData(sortedDataProgressAmount);

  }

    return(
        <div className="main">
          <Sidebar/>
            <div className="content">
              <div className="breadcrumbs" style={{marginTop:"0.5%",marginLeft:"0.5%"}}>
                <ul className="ulist" >
                  <Link to={"/home_page"} classname="cursor-pointer hover:bg-[E8DAEF] p-4 rounded-md p-4 rounded-md">
                  Home <span> / </span>
                  </Link>
                  <Link to={"/projectdetails"} classname="cursor-pointer hover:bg-[E8DAEF] p-4 rounded-md p-4 rounded-md">
                   Project Details 
                  </Link>
                </ul>
              </div>
                <div className="buttons" >
                <div style={{}} className="controls" > <input type="text" placeholder="  Filter items" onChange={(e)=>setSearch(e.target.value)} style={{height:"30px",width:"240px"}}/></div>

                    <div className="projectheadingdetails" style={{}}><h1 >PROJECT DETAILS</h1></div>
                    <div className="handleprojectbutton">
                    <Button variant="contained" onClick={()=>handleproject(data)} sx={{ height:"45px",width:"150px", fontSize: "15px"}}> + Add Project</Button>
                    
                    </div>
                     </div>
                <div className="project_details_table" >
                 <TableContainer component={Paper} sx={{marginTop:"0%",border:"1px solid grey", width:"97%",height:"97%",marginLeft:"auto",marginRight:"auto"}} >
             <Table sx={{ minWidth: 650 }} aria-label="simple table">
               <TableHead>
                 <TableRow sx={{border:"solid 1 px black"}}>
                 <TableCell sx={{backgroundColor:"lightgrey"}}>PROJECT ID {sortData==="asc"?(<TiArrowSortedDown style={{cursor:"pointer"}} onClick={sortId}/>):
                 (<TiArrowSortedUp style={{cursor:"pointer"}} onClick={sortId}/>)} </TableCell>
                   <TableCell sx={{backgroundColor:"lightgrey"}}>PROJECT NAME {sortData==="asc"?(<TiArrowSortedDown style={{cursor:"pointer"}} onClick={sortName}/>
                   ):(<TiArrowSortedUp style={{cursor:"pointer"}} onClick={sortName}/>) 
                  }</TableCell>
                   <TableCell sx={{backgroundColor:"lightgrey"}} >AMOUNT {sortData === "asc" ? (
                    <TiArrowSortedDown style={{ cursor: "pointer" }} onClick={sortAmount} />
                  ) : (
                    <TiArrowSortedUp style={{ cursor: "pointer" }} onClick={sortAmount} />
                  )}</TableCell>
                   {/* <button onClick={setSort("desc")}><TiArrowSortedDown/></button> */}
                   <TableCell sx={{backgroundColor:"lightgrey"}}>COST{sortData === "asc" ? (
                    <TiArrowSortedDown style={{ cursor: "pointer" }} onClick={sortCost} />
                  ) : (
                    <TiArrowSortedUp style={{ cursor: "pointer" }} onClick={sortCost} />
                  )}</TableCell>
                   <TableCell sx={{backgroundColor:"lightgrey"}}>START DATE{sortData === "asc" ? (
                    <TiArrowSortedDown style={{ cursor: "pointer" }} onClick={sortStartDate} />
                  ) : (
                    <TiArrowSortedUp style={{ cursor: "pointer" }} onClick={sortStartDate} />
                  )}</TableCell>
                   <TableCell sx={{backgroundColor:"lightgrey"}}>END DATE{sortData === "asc" ? (
                    <TiArrowSortedDown style={{ cursor: "pointer" }} onClick={sortEndDate} />
                  ) : (
                    <TiArrowSortedUp style={{ cursor: "pointer" }} onClick={sortEndDate} />
                  )}</TableCell>
                   <TableCell sx={{backgroundColor:"lightgrey"}}>CREATED BY{sortData === "asc" ? (
                    <TiArrowSortedDown style={{ cursor: "pointer" }} onClick={sortCreatedBy} />
                  ) : (
                    <TiArrowSortedUp style={{ cursor: "pointer" }} onClick={sortCreatedBy} />
                  )}</TableCell>
                   <TableCell sx={{backgroundColor:"lightgrey"}}>PROGRESS %{sortData === "asc" ? (
                    <TiArrowSortedDown style={{ cursor: "pointer" }} onClick={sortProgressPercentage} />
                  ) : (
                    <TiArrowSortedUp style={{ cursor: "pointer" }} onClick={sortProgressPercentage} />
                  )}</TableCell>
                   <TableCell sx={{backgroundColor:"lightgrey"}}>PROGRESS AMOUNT{sortData === "asc" ? (
                    <TiArrowSortedDown style={{ cursor: "pointer" }} onClick={sortProgressAmount} />
                  ) : (
                    <TiArrowSortedUp style={{ cursor: "pointer",border:"solid black 1px" }} onClick={sortProgressAmount} />
                  )}</TableCell>
                  <TableCell sx={{backgroundColor:"lightgrey"}}></TableCell>
                  <TableCell sx={{backgroundColor:"lightgrey"}}></TableCell>
                  <TableCell sx={{backgroundColor:"lightgrey"}}></TableCell>
                 </TableRow>
               </TableHead>
               <TableBody>
                 {paginatedData.filter((item)=>{
                  if(search.toLowerCase()===""){
                    return item;
                  }
                  else if(item.name.toLowerCase().includes(search.toLowerCase())||
                item.start_date.toLowerCase().includes(search.toLowerCase())||item.end_date.toLowerCase().includes(search.toLowerCase())||
                item.created_by.toLowerCase().includes(search.toLowerCase())||String(item.cost).toLowerCase().includes(search.toLowerCase())
                ||String(item.id).toLowerCase().includes(search.toLowerCase())||String(item.amount).toLowerCase().includes(search.toLowerCase())
                ||String(item.progress_amount).toLowerCase().includes(search.toLowerCase())||item.progress_percentage.toLowerCase().includes(search.toLowerCase())){
                  return item;
                }
                return false;
                 }).length>0?(paginatedData.filter((item)=>{return search.toLowerCase() === ''
                  ? item
                  : item.name.toLowerCase().includes(search.toLowerCase())||
                  item.start_date.toLowerCase().includes(search.toLowerCase())||item.end_date.toLowerCase().includes(search.toLowerCase())||
                  item.created_by.toLowerCase().includes(search.toLowerCase())||String(item.cost).toLowerCase().includes(search.toLowerCase())
                  ||String(item.id).toLowerCase().includes(search.toLowerCase())||String(item.amount).toLowerCase().includes(search.toLowerCase())
                  ||String(item.progress_amount).toLowerCase().includes(search.toLowerCase())||item.progress_percentage.toLowerCase().includes(search.toLowerCase());
              }).map((item,index)=>(
                <TableRow key={index}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell><Link to={`/project_page/${item.id}`}>{item.name}</Link></TableCell>
                  <TableCell>{item.amount}</TableCell>
                  <TableCell>{item.cost}</TableCell>
                  <TableCell>{item.start_date}</TableCell>
                  <TableCell>{item.end_date}</TableCell>
                  <TableCell>{item.created_by}</TableCell>
                  <TableCell>{item.progress_percentage}</TableCell>
                  <TableCell>{item.progress_amount}</TableCell>
                  <TableCell><Button variant="text" onClick={()=>handle_add_progress(item,item.id,item.amount,item.progress_amount)}>+ ADD Progress</Button></TableCell>
                  <TableCell><Button variant="text" onClick={()=>handle_progress_detail(item.id)}>Progress Log</Button></TableCell>
                  <TableCell><label></label>
                  {/* <input type="file" name="fileuploaded" onChange={handleAddFile}/>
                  <Button onClick={()=>{addfilefunction(file)}}>Upload</Button> */}
                  </TableCell>
                </TableRow>)))
                 : (
                  <TableRow>
                    <TableCell colSpan={9} align="center">
                      No matching records found
                    </TableCell>
                  </TableRow>)}
              </TableBody>
            </Table>
            </TableContainer>
                
            <TablePagination
            component="div"
            count={data.length} 
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[4, 8, 12]} 
            style={{marginRight:"2%"}}
          />
            </div>
            </div>
            <Dialog1
            open={openDialog}
            setdialog={setOpenDialog}
            setData={setData}
            data={data}/>
            <Dialog_add_project
                open={openDialogAddProgress}
                setdialog={setOpenDialogProgress}
                setProject={setProject}
                id={projectId}
                onClose={handleCloseProgressDialog}  // Use the close handler
                project={project}
                setData={setData}
                data={data}
                project_amount={project_amount}
                progress_amount={progress_amount}
            />
            <Progress_detail
                open={openProgress}
                setdialog={setOpenProgress}
                id={progressId}  
            />
        
        </div>
    )
}