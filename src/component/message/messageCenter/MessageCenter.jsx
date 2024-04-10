import React, { useContext, useEffect, useRef, useState } from 'react'
import './messageCenter.css'
import { MyContext } from '../../../context/AuthContext';
import { format } from 'timeago.js'
import axios from 'axios';

function MessageCenter() {

  const { user : currentUser, messages,setMessages, conversation,convId ,convProfilePic, recipientId, socket } = useContext(MyContext);
  const [ textMessage, setTesxtMessage ] = useState('');
 
  const messageRef = useRef();
  const typeRef = useRef();
  const [ typing, setTyping ] = useState(false);

  useEffect(()=>{
   console.log(convId, recipientId, messages);
   console.log('hiiiiiiiiiiiiii')
  },[])
  useEffect(() => {
    socket?.on('newMessage', (message) => {
      console.log('a new message from live server...', message);
      // Update messages state by merging existing messages with the new message
      setMessages((prevMessages) => [...prevMessages, message]);
      console.log(messages, 'yes')
    });

    socket?.on('userTyping', (data)=>{
      console.log('typing//',data, recipientId );
      console.log('rrrr', recipientId);
      if(data.userId === recipientId ){
        setTyping(true);
        if(typeRef.current){
        typeRef.current.scrollIntoView({ behavior : 'smooth'});
      }}
    });

    socket?.on('userNotTyping', (data)=>{
      if(data.userId === recipientId ){
        setTyping(false);
      }
    })
  
    // Clean up the socket event listener
    return () => {
      socket?.off('newMessage');
    };
  }, [socket, recipientId]);
  

  const handleMessageSend = async (e)=>{
    e.preventDefault();
    console.log(currentUser._id);
    console.log(convId);
    console.log(recipientId);
    console.log(textMessage);

    try{
      const response = await axios.post(`https://recruit-link-socket-backend.onrender.com/api/conversation/message/${convId}`, {
        senderId : currentUser._id,
        recieverId : recipientId,
        text : textMessage
      });
      if(response.data){
        const newMessage = {
          senderId : currentUser._id,
          recieverId : recipientId,
          text : textMessage,
          createdAt : Date.now()
        };
        socket?.emit('sendMessage', newMessage);
        setTesxtMessage('')
        setMessages([...messages, newMessage]);
      }
    }catch(err){
      console.log(err);
    }
  }

  // console.log(messages, conversation);

  const scrollToBottom = ()=>{
    if(messageRef.current){
      messageRef.current.scrollIntoView({ behavior : 'smooth' })
    }
  }
  useEffect(()=>{
    scrollToBottom();
  },[messages])

  // const handleIsTyping = ()=>{
  //   const details = currentUser._id
  //   socket.emit('typing' , details);
  // };

  // const handleNotTyping = ()=>{
  //   const details = currentUser._id;
  //   socket.emit('notTyping', details);
  // }

  useEffect(()=>{
    if(textMessage.length > 0 ){
      const details = {
        userId : currentUser._id,
        recipientId
      }
    socket?.emit('typing' , details);
    }else{
      const details = {
        userId : currentUser._id,
        recipientId
      }
    socket?.emit('notTyping', details);
    }
  },[textMessage])

  return (
    <div className="messageCenterContainer">
      <div className="messageCenterWrapper">
        <div className="messageCenterBody">
          <div className="messageCenterBodyContainer">
            {
        messages && messages?.length > 0 ? <>
            {messages?.map((message, index)=>(
              <li key={index} style={{ listStyle : 'none'}}
              className={message.senderId != currentUser._id ?
                'notOwn' : 'own' 
                }
                >
                <div className="messageCenterBodyMessages">
                <img src={message.senderId != currentUser._id ? (convProfilePic ? convProfilePic : '/assets/person/avatar.png') : (currentUser.profilePicture ? currentUser.profilePicture : '/assets/person/avatar.png')} alt="" />
                <p ref={messageRef}>{message.text}</p>
                </div>
                <b>{format(message.createdAt)}</b>
              </li>
            ))}
            </>
            :
            <div className="noMessageContainer text-center mt-5 p-5">
              <img src={'/assets/noMessage.jpg'} alt="No Messages"/>
            </div>
          }
          {typing && <p ref={typeRef}>Typing...</p> }
          </div>
        </div>
        { convId && convId?.length > 0 ? 
        <div className="messageCenterInput">
          <form onSubmit={handleMessageSend}>
          <input type="text" value={textMessage} required placeholder='Type Something...' onChange={(e)=>setTesxtMessage(e.target.value)}/>
          <button type='submit'>Send</button>
          </form>
        </div>
        :
        <div className="noConversationContainer text-center">
          <h1>RECRUIT_LINK</h1>
          <h4>Select Conversation To Start Messaging...</h4>
        </div>
        }
      </div>
    </div>
  )
}

export default MessageCenter