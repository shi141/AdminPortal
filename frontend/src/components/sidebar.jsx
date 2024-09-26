import React, { useState } from "react";
import { BiHome, BiSolidReport } from "react-icons/bi";
import { FaUserAlt, FaUserEdit } from "react-icons/fa";
import { CiLogout } from "react-icons/ci";
import { RiAdminFill } from "react-icons/ri";
import "../styles/sidebar.css";  // Your CSS file
import { MdOutlineMenuOpen } from "react-icons/md";
import { LuPanelLeftClose } from "react-icons/lu";
import { RiMenuUnfold3Line } from "react-icons/ri";
import { FaFileUpload } from "react-icons/fa";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true); // State to manage sidebar visibility

  // Function to toggle the sidebar
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
      <div className={`menu ${isOpen ? "open" : "closed"}`}>
        <div className="menu--list">
          <br/>
          <div className="toggle-button">
            <label>{isOpen ? "Dashboard" : ""}  </label>
          <button onClick={toggleSidebar}>{isOpen ? <MdOutlineMenuOpen size={27}/> : <RiMenuUnfold3Line size={27}/> }</button>

          </div>
          <br/>
          <br/><br/>
          <a href="/home_page" className="item">
            <BiHome size={27} />
            {isOpen && "Home"} 
          </a>
          <a href="/admin" className="item">
            <RiAdminFill size={27} />
            {isOpen && "Admin Details"}
          </a>
          <a href="/user_access" className="item">
            <FaUserAlt size={27} />
            {isOpen && "User Management"}
          </a>
          <a href="/projectdetails" className="item">
            <BiSolidReport size={27} />
            {isOpen && "Project"}
          </a>
          <a href="/admin" className="item">
            <FaUserEdit size={27} />
            {isOpen && "Editor Details"}
          </a>
          <a href='/uploadCsv' className="item">
          <FaFileUpload size={27}/>
          {isOpen && "Upload CSV"}
          </a>
          <a href="/" className="item">
            <CiLogout size={27} />
            {isOpen && "Logout"}
          </a>
        </div>
      </div>
    
  );
};

export default Sidebar;
