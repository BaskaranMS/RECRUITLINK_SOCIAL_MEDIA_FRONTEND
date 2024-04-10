import React from 'react'
import './friends.css'

function Friends({user}) {
    return (
        <li className="sidebarFriend">
            <img src={user.profilePic} alt="" className='sidebarFriendImage' />
            <span className="sidebarFriendName">{user.username}</span>
        </li>
    )
}

export default Friends