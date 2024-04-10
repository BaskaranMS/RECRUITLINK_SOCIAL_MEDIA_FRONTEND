import React, { useContext, useState, useEffect } from 'react'
import './topbar.css'
import { Link } from 'react-router-dom'
import { MyContext } from '../../context/AuthContext';
import { Modal, Button  } from 'react-bootstrap'

function Topbar({message}) {

    // const { user } = useContext(AuthContext);
    const { user, appUsers } = useContext(MyContext);
    const [ users, setUsers ] = useState([]);
    const [ text, setText ] = useState('');
    const [ showAppUsers, setShowAppUsers ] = useState(false);

    useEffect(()=>{
    console.log(appUsers);
    if( text.length < 1 ){
        setUsers([]);
        return;
    }
        const filtered = appUsers.filter((user)=>{
            console.log(user.username.includes(text));
            return user.username.toLowerCase().includes(text);
        });
        setUsers(filtered);
    },[text]);
   

    const handleInput = ()=>{
        setShowAppUsers(true);
    };

    const closeAppUsers = ()=>{
        setUsers([]);
        setShowAppUsers(false);
    };

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
            <input type="text" placeholder='search for friend by username' className="searchInput" onClick={handleInput}/>
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

        <Modal
        show={showAppUsers}
        onHide={closeAppUsers}
        dialogClassName="modal-90w"
        aria-labelledby="example-custom-modal-styling-title"
        centered
      >
        <Modal.Header className='appUsersHeader'>
            <input type="text" onChange={(e)=>setText(e.target.value)} placeholder='Search Friends by Username...' style={{
                width : '100%',
                height : '50px',
                padding : '10px',
                fontSize : '20px',
                borderRadius : '20px'
            }}/>
        </Modal.Header>
        <Modal.Body className='appUsersBodyContainer'>
            { users.length > 0 ? users.map((user, index)=>(
                <Link to={'/profile/'+user.username} style={{ textDecoration : 'none' }} className='bodyLink'>
                <li key={index} style={{ listStyle : 'none'}} onClick={()=>handleSelectedUser(user)}>
                    <div className="allAppUsersContainer">
                    <img src={user.profilePicture || '/assets/person/avatar.png'} alt="Full Screen" className="img-fluid" />
                    <h4>{user.username}</h4>
                    </div>
                </li>
                </Link>
            ))
        :
        <p>No Users Found...</p>
        }
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeAppUsers}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

    </div>
  )
}

export default Topbar