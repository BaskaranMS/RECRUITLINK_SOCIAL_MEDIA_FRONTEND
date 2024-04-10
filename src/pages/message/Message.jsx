import React, { useContext, useEffect } from 'react'
import './message.css'
import MessageLeft from '../../component/message/messageLeft/MessageLeft'
import MessageCenter from '../../component/message/messageCenter/MessageCenter'
import MessageRight from '../../component/message/messageRight/MessageRight'
import Topbar from '../../component/topbar/Topbar'
import { MyContext } from '../../context/AuthContext'
import  axios  from 'axios'

function Message() {

    const { setConvId, setRecipientId, setMessages, setConversation, user:currentUser } = useContext(MyContext);
    useEffect(()=>{

        const fetchData = async ()=>{
            try{
                const res = await axios.get(`https://recruit-link-socket-backend.onrender.com/api/conversation/${currentUser._id}`);
                console.log('conversation fetched from the message page...', res.data);
                setConversation(res.data);
            }catch(err){
                console.log('Error fetching conversation from message page...', err);
            }
        }
        fetchData();
        return ()=>{
            setConvId('');
            setMessages([]);
            setRecipientId('');
        }
    },[])

    return (
        <div className="messageContainer">
            <div className="messageWrapper">
                <div className="messageTopbar">
                <Topbar message={true}></Topbar>
                </div>
                <div className="messageBody">
                    <div className="messageLeft">
                        <MessageLeft></MessageLeft>
                    </div>
                    <div className="messageCenter">
                        <MessageCenter />
                    </div>
                    <div className="messageRight">
                        <MessageRight />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Message