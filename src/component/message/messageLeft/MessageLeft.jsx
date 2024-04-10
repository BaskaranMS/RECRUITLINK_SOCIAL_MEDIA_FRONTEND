import React from 'react'
import MessageBodyLeft from '../messageBodyLeft/MessageBodyLeft'
import './messageLeft.css'

function MessageLeft() {

  return (
    <div className="messageLeftContainer">
        <div className="messageLeftWrapper">
            <input type="text" placeholder='search Friends...'/>
            <div className="messageLeftWrapperBody">
            <MessageBodyLeft></MessageBodyLeft>
            </div>
        </div>
    </div>
  )
}

export default MessageLeft