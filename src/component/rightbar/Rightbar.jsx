import React, { useContext, useEffect, useState } from 'react'
import './rightbar.css'
import Online from '../online/Online'
import axios from 'axios'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { MyContext } from '../../context/AuthContext'

function Rightbar({user}) {
  const [ friends, setFriends ] = useState([]);
  const [ friendsData, setFriendsData ] = useState([]);
  const [ id, setId ] = useState('');

  const [ onlineFriends, setOnlineFriends ] = useState([]);
  const navigate = useNavigate();

  const username = useParams().username;
  console.log(username);

  useEffect(()=>{
    const filtered = friends.filter((data)=>{
      return data.username != username;
    });
    setFriendsData(filtered);
    const id = friends.filter((data)=>{
      return data.username === username
    });
    console.log('current page user ', id);
    setId(id[0]?._id)
  },[friends])
  // const { user:currentUser, dispatch } = useContext( AuthContext );
  const { user:currentUser, onlineFriendsData, setUser, setConversation, url } = useContext(MyContext);

  useEffect(()=>{
    const filteredData = onlineFriendsData.filter((friend)=>{
      return friend.userId != currentUser._id
    });
    setOnlineFriends(filteredData);
  },[onlineFriendsData])

  // const [ followed, setFollowed ] = useState(async ()=>{
  //   if(user){
  //     console.log(user);
  //     const response = await axios.get(`http://localhost:8800/api/users?username=${username}`);
  //     console.log(response.data);
  //     if(currentUser.following.includes(response.data._id)){
  //       console.log('yes');
  //       return true;
  //     }else{
  //       console.log('no');
  //       return false;
  //     }
  //   }
  // });
  const [followed, setFollowed] = useState(false);

useEffect(() => {
  const fetchData = async () => {
    if (user) {
      const localData = JSON.parse(localStorage.getItem('recruitLinkUser'));
      console.log(user);
      const response = await axios.get(`${url}/users?username=${username}`);
      console.log(response.data);
      setId(response.data._id)
      if (localData.following.includes(response.data._id)) {
        console.log('yes');
        setFollowed(true);
      } else {
        console.log('no');
        setFollowed(false);
      }
    }
  };

  fetchData();
}, [username]);

  useEffect(()=>{
    console.log('Current User:', currentUser);
    console.log(user?._id);
    console.log(followed);

    return ()=>{
      setFriendsData([]);
      setFriends([]);
    }
  },[])
  {
    user ?
    useEffect(()=>{
      const fetch = async ()=>{
        try{
          const res = await axios.get(`${url}/users/friends/${currentUser._id}`);
          console.log('friends...',res.data)
          setFriends(res.data);
        }catch(err){
          console.log(err);
        }
      };
      fetch();
    },[currentUser._id, username])
    :
    '' 
  }

  useEffect(()=>{
    console.log('follow check' , followed)
  },[followed]);

  const handleMessage = async ()=>{

    console.log('handle message your id', currentUser._id);
    console.log('handle message recipient id', id);
    // const userId = currentUser._id;

    try{
      console.log(id)
      const res = await axios.post(`${url}/conversation/newConversation/${id}/${currentUser._id}`,);
      console.log(res);
      try{
        const res = await axios.get(`${url}/conversation/${currentUser._id}`);
        console.log('conversation fetched from the message page...', res.data);
        setConversation(res.data);
        navigate('/messages')
    }catch(err){
        console.log('Error fetching conversation from message page...', err);
    }
    }catch(err){
      console.log('error message', err);
      alert('An error Occured');
    }
    // navigate('/messages')
  }

  const handleFollow = async ()=>{
    try{
      if(followed){
        const response = await axios.put(`${url}/users/${user._id}/unfollow`, { userId : currentUser._id});
        console.log(response.data, 'followed');
        setUser(response.data);
        localStorage.setItem('recruitLinkUser', JSON.stringify(response.data));
        // dispatch({ type : "UNFOLLOW", payload : user._id})
      }else{
        const response = await axios.put(`${url}/users/${user._id}/follow`, { userId : currentUser._id});
        console.log(response.data);
         setUser(response.data);
        localStorage.setItem('recruitLinkUser', JSON.stringify(response.data));
        // dispatch({ type : "FOLLOW", payload : user._id});
      }
      setFollowed(!followed);
    }catch(err){
      console.log(err);
    }
  }


  const HomeRightbar = ()=>{
    return (
      <>
      <div className="birthdayContainer">
          <img src="/assets/gift.png" alt="" className="birthdayImage" />
          <span className="birthdayText"><b>Zender</b> and <b> 3 other friends </b>have a birthday today.</span>
        </div>
        <img src="/assets/ad.png" alt="" className="rightbarAd" />
        <h4 className="rightbarTitle">Online Friends</h4>
        <ul className="onlineFriendList">
          {/* {onlineFriends.map(use=>(
            <Online key={use.id} user={use}></Online>
          ))} */}
          {/* Filter out duplicate users based on userId */}
        {onlineFriends.reduce((uniqueUsers, currentUser) => {
          return uniqueUsers.some(user => user.userId === currentUser.userId) ? uniqueUsers : [...uniqueUsers, currentUser];
        }, []).map(user => (
          <Online key={user.userId} user={user} />
        ))}
        </ul>
      </>
    )
  }

  const ProfileRightbar = ()=>{
    
    return (
      <>
      {
        user.username != currentUser.username && (
          <button className="rightbarFollowButton" onClick={handleFollow}>
            { followed ? 'unfollow' : 'follow' }
            { followed ? <i className="fa-solid fa-user-minus"></i> : <i className="fa-solid fa-user-plus"></i>}
          </button>
        )
      }
      {
        user.username != currentUser.username && (
          <button className="rightbarMessageButton btn btn-dark" onClick={handleMessage}>
            Message
          </button>
        )
      }
      <h4 className="rightbarTitle">User Information</h4>
      <div className="rightbarInfo">
        <div className="rightbarInfoItem">
          <span className="rightbarInfoKey">City : </span>
          <span className="rightbarInfoValue">{user.city}</span>
        </div>
        <div className="rightbarInfoItem">
          <span className="rightbarInfoKey">From : </span>
          <span className="rightbarInfoValue">{user.from}</span>
        </div>
        <div className="rightbarInfoItem">
          <span className="rightbarInfoKey">Relationship : </span>
          <span className="rightbarInfoValue">{user.relationship === 1 ? "single" : user.relationship === 2 ? "Married" : user.relationship === 3 ? "In Relation" : 'Not Mentioned'}</span>
        </div>
      </div>
      <h4 className="rightbarTitle">User Friends</h4>
      <div className="rightbarFollowings">
        {friendsData.map((friend, index) =>(
                  <div className="rightbarFollowing" key={ index }>
                    <Link to={`/profile/${friend.username}`} style={{ textDecoration : 'none'}}>
                    <img src={friend.profilePicture || '/assets/person/avatar.png'} alt="" className="rightbarFollowingImg" />
                  <span className="rightbarFollowingName">{friend.username}</span>
                    </Link>
                </div>
        ))}
      </div>
      </>
    )
  }
  return (
    <div className='rightbarContainer'>
      <div className="rightbarWrapper">
        { user ? <ProfileRightbar></ProfileRightbar> : <HomeRightbar></HomeRightbar>}
      </div>
    </div>
  )
}

export default Rightbar