import React, { useContext, useEffect, useState } from 'react'
import './profile.css'
import Topbar from '../../component/topbar/Topbar'
import Sidebar from '../../component/sidebar/Sidebar'
import Feed from '../../component/feed/Feed'
import Rightbar from '../../component/rightbar/Rightbar'
import axios from 'axios'
import { useParams, useNavigate } from 'react-router-dom'
import { MyContext } from '../../context/AuthContext'
import { Button, Modal } from 'react-bootstrap';



function Profile() {

  const [ users, setUsers ] = useState({});
  const username = useParams().username;
  const [ admin , setAdmin ] = useState(false);
  const { user, url } = useContext(MyContext);

  const navigate = useNavigate();

  const [showFullScreen, setShowFullScreen] = useState(false);
  const [ fullScreenImage, setFullScreenImage ] = useState('');

  useEffect(()=>{
    const fetchUsers = async ()=>{
        const response = await axios.get(`${url}/users?username=${username}`);
        setUsers(response.data);
        console.log(response.data)
        if(user.username == username){
          setAdmin(true);
        }
    };

    fetchUsers()
},[username]);

const toggleFullScreen = (target) => {
  if(target == 'cover'){
    setFullScreenImage(users.coverPicture || "/assets/person/cover.png");
  }else{
    setFullScreenImage(users.profilePicture || "/assets/person/avatar.png");
  }
  setShowFullScreen(true);
};

const closeFullScreen = ()=>{
  setFullScreenImage('');
  setShowFullScreen(false);
};

const handleEditProfileIcon = ()=>{
  navigate(`/profile/${user.username}/editProfile`);
}

  return (
    <div>
    <Topbar></Topbar>
    <div className="profileContainer">
        <Sidebar></Sidebar>
        <div className="profileRight">
          <div className="profileRightTop">
            <div className="profileCover">
            <img src={users.coverPicture || "/assets/person/cover.png"}
            onDoubleClick={()=>toggleFullScreen('cover')} alt="" className="profileCoverImg" />
            <img src={users.profilePicture || "/assets/person/avatar.png"} 
            onDoubleClick={()=>toggleFullScreen('profile')} alt="" className="profileUserImg" />
            { admin && <button onClick={handleEditProfileIcon} style={{backgroundColor:'inherit', border:'none'}}><i className="fa-solid fa-user-pen" id='editProfileIcon'></i></button> }
            </div>
            <div className="profileInfo">
              <h4 className="profileInfoName">{users.username}</h4>
              <span className="profileInfoDesc">{users.desc}</span>
            </div>
          </div>
          <div className="profileRightBottom">
          <Feed username={username} admin={admin}></Feed>
        <Rightbar user={users}></Rightbar>
          </div>
        </div>
    </div>

    <Modal
        show={showFullScreen}
        onHide={closeFullScreen}
        dialogClassName="modal-90w"
        aria-labelledby="example-custom-modal-styling-title"
      >
        <Modal.Body>
          <img src={fullScreenImage} alt="Full Screen" className="img-fluid" />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeFullScreen}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>


</div>
  )
}

export default Profile