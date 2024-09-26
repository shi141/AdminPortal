import { useNavigate, useParams } from 'react-router-dom';
import './styles/project_page.css';
import { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { PieChart } from '@mui/x-charts/PieChart';
import { Link } from "react-router-dom";

function Project_page() {
  const { id } = useParams();
  const [data,setData]=useState([]);
  const [projectData,setProjectData]=useState([]);
  const navigate=useNavigate();

  useEffect(() => {
    const fetchdata = async () => {
        if ({id}) {
            const token = localStorage.getItem('access_token');
            const response = await fetch(`http://127.0.0.1:800/progress_details/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,  // Include JWT token in the Authorization header
                }
            });
            if (response.ok) {
                const data = await response.json();
                setData(data);
            }
        }
    };
    fetchdata();
}, [id]);
useEffect(() => {
  const fetchProject = async () => {
      if ({id}) {
          const token = localStorage.getItem('access_token');
          const response = await fetch(`http://127.0.0.1:800/project/${id}`, {
              method: 'GET',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`,  // Include JWT token in the Authorization header
              }
          });
          if (response.ok) {
              const data = await response.json();
              setProjectData(data);
          }
      }
  };
  fetchProject();
}, [id]);
console.log("project");
console.log(projectData.progress_percentage);
const handleback=()=>{
  navigate('/projectdetails');
}

  return (
    <div className='mainContainer'>
      
      <div className='secondContainer'>
      
        <div className='project_details'>
          <div className='breadcrumbs'>
          <ul className="ulist">
        <Link
          to={"/home_page"}
          className=" cursor-pointer hover:bg-[#E8DAEF] p-4 rounded-md">
          Home<span> / </span>
        </Link>
        <Link
          to={"/projectdetails"}
          className=" cursor-pointer hover:bg-[#E8DAEF] p-4 rounded-md transition-all duration-300">
          Project Details<span> / </span>
        </Link>
        <Link
          to={"/project_page/:id"}
          className=" cursor-pointer hover:bg-[#E8DAEF] p-4 rounded-md transition-all duration-300">
          Project Page
        </Link>
        
      </ul>
          </div>
        <div className='details'>
          <div className='project'>
          <h3>Project ID   :    </h3>
          <label>{id}</label>
          </div>
          <div className='project'>
          <h3>Project Name :     </h3>
          <label>{projectData.name}</label>
          
          </div>
          <div className='project'>
          <h3>Created By   :     </h3>
          <label>{projectData.created_by}</label>
          </div>
          <div className='project'>
          <h3>Amount       :     </h3>
          <label>{projectData.amount}</label>
          </div>
          <div className='project'>
          <h3>Cost         :     </h3>
          <label>{projectData.cost}</label>
          </div>
          <div className='project'>
          <h3>Start Date   :     </h3>
          <label>{projectData.start_date}</label>
          </div>
          <div className='project'>
          <h3>End Date     :   </h3>
          <label> {projectData.end_date} </label>
          </div>
          
        </div>
        </div>
        <div className='pie_chart'>
          <div className='heading' style={{display:"flex",flexDirection:"row",margin:"0",height:"26px",marginTop:"2%"}}>
          <h3 style={{marginLeft:"5%"}}>Project task completion</h3>
          <button onClick={()=>handleback()} variant="contained" style={{marginRight:"0%",marginLeft:"40%",marginTop:"5px",width:"100px",height:"40px",color:"white",backgroundColor:"rgb(64, 118, 218)", cursor:"pointer"}}>Back</button>
          </div>
          
          <PieChart
          colors={['blue', 'purple']}
      series={[
        {
          data: [
            { id: 0, value: (projectData.amount_completed)||0, label: 'Completed' },
            { id: 1, value: (projectData.amount-projectData.amount_completed)||0, label: 'Incomplete' },
          ],
        },
      ]}
      width={500}
      height={270}
      marginTop={"5px"}
    />
        </div>
      </div>
      <div className='progress_logs'>
        <div className='progress'>
        <h3><b> Progress Logs </b> </h3>
        </div>
      <TableContainer component={Paper} sx={{ marginTop: "1%" }}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>PROGRESS ID</TableCell>
                            <TableCell>PROJECT DATE</TableCell>
                            <TableCell>AMOUNT</TableCell>
                            <TableCell>ADDED BY</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell>{item.progress_id}</TableCell>
                                <TableCell>{item.progress_date}</TableCell>
                                <TableCell>{item.amount_completed}</TableCell>
                                <TableCell>{item.created_by}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
      </div>
    </div>
  );
}

export default Project_page;
