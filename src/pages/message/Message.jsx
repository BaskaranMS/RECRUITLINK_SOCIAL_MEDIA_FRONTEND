import React, { useContext, useEffect } from 'react'
import './message.css'
import MessageLeft from '../../component/message/messageLeft/MessageLeft'
import MessageCenter from '../../component/message/messageCenter/MessageCenter'
import MessageRight from '../../component/message/messageRight/MessageRight'
import Topbar from '../../component/topbar/Topbar'
import { MyContext } from '../../context/AuthContext'

function Message() {

    const { setConvId, setRecipientId, setMessages } = useContext(MyContext);
    useEffect(()=>{
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