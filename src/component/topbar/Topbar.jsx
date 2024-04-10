import React, { useContext } from 'react'
import './topbar.css'
import { Link } from 'react-router-dom'
import { MyContext } from '../../context/AuthContext';


function Topbar({message}) {

    // const { user } = useContext(AuthContext);
    const { user } = useContext(MyContext);
  return (
    <div className="topbarContainer">
        <div className="topbarLeft">
            <Link to='/' style={{textDecoration:'none'}}>
            <span className="logo">RecruitLink</span>
            </Link>
        </div>
        { !message ?
        <div className="topbarCenter">
            <div className="searchbar">
            <i className="fa-solid fa-magnifying-glass" id='searchIcon'></i>
            <input type="text" placeholder='search for friend by username' className="searchInput" />
            </div>
        </div>
        : '' }
        <div className="topbarRight">
            <div className="topbarLinks">
                <span className="topbarLink">Homepage</span>
                <span className="topbarLink">TimeLine</span>
            </div>
            <div className="topbarIcons">
                <div className="topbarIconItems">
                <i className="fa-solid fa-user"></i>
                <span className="topbarIconBadge">1</span>
                </div>
                <div className="topbarIconItems">
                <i className="fa-brands fa-rocketchat"></i>
                <span className="topbarIconBadge">2</span>
                </div>
                <div className="topbarIconItems">
                <i className="fa-solid fa-bell"></i>
                <span className="topbarIconBadge">1</span>
                </div>
            </div>
            <Link to={`/profile/${user.username}`}>
            <img src={user.profilePicture || "/assets/person/avatar.png"} alt="" className="topbarImg" />
            </Link>
        </div>
    </div>
  )
}

export default Topbar