import React, { useContext } from 'react'
import './messageBodyLeft.css'
import { MyContext } from '../../../context/AuthContext'

function MessageBodyLeft() {

    const { conversation, messages, setMessages, convId, setConvId, setConvProfilePic, setRecipientId } = useContext(MyContext);
    console.log(conversation);

    const handleChatClick = (conv)=>{
        console.log('hiii', conv)
        setMessages(conv._doc.messages);
        // console.log(messages)
        // console.log(conv._doc.messages);
        console.log(conv._doc._id);
        setConvId(conv._doc._id);
        setConvProfilePic(conv.profilePic);
        setRecipientId(conv.userId);
        // console.log(convId)
    }
    return (
        <>
        <div className="messageLeftBodyContainer">
        { conversation?.map((conv)=>(
            <li key={conv._id} style={{ listStyle : 'none'}} className='messageLeftBodyList' >
        <div className="messageLeftBody">
            <img src={conv?.profilePic ? conv.profilePic : '/assets/person/avatar.png'} alt="" />
            <p onClick={()=>handleChatClick(conv)}>{conv?.username}</p>
        </div>
            </li>
        ))}
        </div>
        </>
    )
}

export default MessageBodyLeft