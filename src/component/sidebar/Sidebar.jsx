import React, { useEffect, useState } from 'react'
import './sidebar.css'
import Friends from '../friends/Friends'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
function Sidebar() {

  const navigate = useNavigate();

  const handleLogOut = ()=>{
    localStorage.removeItem('user');
    localStorage.removeItem('auth');
    localStorage.removeItem('recruitLinkUser');
    navigate('/login')
  }

  const [followings, setFollowings] = useState([]);
  const [followingsData, setFollowingsData] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('recruitLinkUser'));
    if (user) {
      setFollowings(user.following || []);
    }
  }, []);
  
  useEffect(() => {
    const fetchFollowingsData = async () => {
      const user = JSON.parse(localStorage.getItem('recruitLinkUser'));
      if (!user || followings.length === 0) {
        return;
      }
  
      try {
        const requests = followings.map(async (userId) => {
          const response = await axios.get(`https://recruit-link-socket-backend.onrender.com/api/users/fetchUser/${userId}`);
          return response.data;
        });
        
        const responseData = await Promise.all(requests);
        setFollowingsData(responseData);
      } catch (error) {
        console.error("Error fetching followings data:", error);
      }
    };
  
    fetchFollowingsData();
  }, [followings]);
  
  return (
    
    <div className="sidebarContainer">
      <div className="sidebarWrapper">
        <ul className="sidebarList">
          <li className="sidebarListItem">
          <i className="fa-solid fa-rss" id='sidebarIcon'></i>
          <span className="sidebarListItemText">Feed</span>
          </li>
            <Link to='/messages' style={{ textDecoration : 'none', color : 'inherit'}}>
          <li className="sidebarListItem">
          <i className="fa-solid fa-message" id='sidebarIcon'></i>
          <span className="sidebarListItemText">Chats</span>
          </li>
            </Link>
          <li className="sidebarListItem">
          <i className="fa-solid fa-play" id='sidebarIcon'></i>
          <span className="sidebarListItemText">Videos</span>
          </li>
          <li className="sidebarListItem">
          <i className="fa-solid fa-user-group" id='sidebarIcon'></i>
          <span className="sidebarListItemText">Groups</span>
          </li>
          <li className="sidebarListItem">
          <i className="fa-solid fa-bookmark" id='sidebarIcon'></i>
          <span className="sidebarListItemText">Bookmarks</span>
          </li>
          <li className="sidebarListItem">
          <i className="fa-regular fa-circle-question" id='sidebarIcon'></i>
          <span className="sidebarListItemText">Questions</span>
          </li>
          <Link to='/jobDashboard' style={{ listStyle : 'none', textDecoration : 'none', color : 'inherit' }}>
          <li className="sidebarListItem">
          <i className="fa-solid fa-briefcase" id='sidebarIcon'></i>
          <span className="sidebarListItemText">Jobs</span>
          </li>
          </Link>
          <li className="sidebarListItem">
          <i className="fa-solid fa-calendar-days" id='sidebarIcon'></i>
          <span className="sidebarListItemText">Events</span>
          </li>
          <li className="sidebarListItem">
          <i className="fa-solid fa-graduation-cap" id='sidebarIcon'></i>
          <span className="sidebarListItemText">Courses</span>
          </li>
          <li className="sidebarListItem" onClick={handleLogOut}>
          <i className="fa-solid fa-graduation-cap" id='sidebarIcon'></i>
          <span className="sidebarListItemText">LogOut</span>
          </li>
        </ul>
        <button className="sidebarButton">Show More</button>
        <hr className='sidebarHr'/>
        <ul className="sidebarFriendList">
          { followingsData.map(( u, index )=>(
            <Friends user={u} key={index}></Friends>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default Sidebar