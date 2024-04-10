import React, { useContext, useEffect , useState } from 'react'
import { MyContext } from '../../../context/AuthContext';
import './messageRight.css'

function MessageRight() {

  const { onlineFriendsData, user:currentUser } = useContext(MyContext);
  const [ friends, setFriends ] = useState([]);

  useEffect(()=>{
    const filteredData = onlineFriendsData.filter((friend)=>{
      return friend.userId != currentUser._id
    });
    setFriends(filteredData);
  },[onlineFriendsData])

  return (
    <div className="messageRightContainer">
      <div className="messageRightWrapper">
        <div className="messageRightTitle">
          <h2>Online Friends</h2>
        </div>
        <div className="messageRightBody">
          { friends.length > 0 ? <>
          { friends.map((friend)=>(
            <li key={friend.userId} style={{ listStyle : 'none'}}>
              <div className="liDiv">
              <img src={friend.profilePic} alt="profile pic" />
              <span className='messageRightOnlineBadge'></span>
              </div>
              <h6>{friend.username}</h6>
            </li>
          ))}
          </> : 'No Friends Are in Online. They are Busy...' }
        </div>
      </div>
    </div>
  )
}

export default MessageRight