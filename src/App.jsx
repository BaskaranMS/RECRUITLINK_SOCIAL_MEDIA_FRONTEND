import React, { useState, useEffect, useRef } from 'react'
import Home from './pages/home/Home'
import Profile from './pages/profile/Profile'
import Login from './pages/login/Login'
import Register from './pages/register/Register'
import JobMain from './pages/jobs/JobMain'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { MyContext } from './context/AuthContext'
// import CryptoJs from 'crypto-js'
import EditProfile from './pages/editProfile/EditProfile'
import JobDashboard from './pages/jobs/JobDashboard'
import ApplyJob from './pages/jobs/ApplyJob'
import FindJobs from './pages/jobs/FindJobs'
import AppliedCandidates from './pages/jobs/AppliedCandidates'
import SendMail from './pages/jobs/SendMail'
import Message from './pages/message/Message'
import VideoCall from './pages/videoCall/VideoCall'
import axios from 'axios'
import { io } from 'socket.io-client'
import Peer from 'peerjs'
// import { v4 as uuidV4 } from 'uuid'

function App() {

  const secret = "i hate this fuckin world";
  const socket = useRef();
  const [ url, setUrl ] = useState('https://recruit-link-socket-backend.onrender.com/api')
  // const [ url, setUrl ] = useState('http://localhost:8800/api');
  const [peerId, setPeerId] = useState('');
  const [ peer, setPeer ] = useState(null);
 

  // const [user, setUser] = useState(() => {
  //   try {
  //     const savedUser = localStorage.getItem('recruitLinkUser');
  //     if (!savedUser) {
  //       return null;
  //     }
  //     const decryptedValue = CryptoJs.AES.decrypt(savedUser, secret);
  //     const final = JSON.parse(decryptedValue.toString(CryptoJs.enc.Utf8));
  //     return final;
  //   } catch (err) {
  //     console.log('error while fetching user detail', err);
  //     return null;
  //   }
  // });
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('recruitLinkUser');
      console.log(JSON.parse(savedUser), 'savedUser')
      if (!savedUser) {
        return null;
      }
      const details = JSON.parse(savedUser);
      console.log(details);
      return details;
    } catch (err) {
      console.log('error while fetching user detail', err);
      return null;
    }
  });

  useEffect(()=>{

    const peer = new Peer();

    peer.on('open', (id)=>{
      setPeerId(id);
      console.log('peer id at app.jsx : ', id);
    });

    setPeer(peer);

    return ()=>{
      peer.destroy();
    };

  },[]);

  useEffect(()=>{
    async function fetchData(){
      if(user){
        const response = await axios.get(`${url}/users?userId=${user._id}`);
        localStorage.setItem('recruitLinkUser', JSON.stringify(response.data));
        console.log('final',response.data);
      }
    };

    fetchData();
  },[user])

  const [isFetching, setIsFetching] = useState(false);
  const [ conversation, setConversation ] = useState([]);
  const [ messages, setMessages ] = useState(null);
  const [ convId, setConvId ] = useState('');
  const [ convProfilePic, setConvProfilePic ] = useState('');
  const [ recipientId, setRecipientId ] = useState('');
  const [ onlineFriends, setOnlineFriends ] = useState([]);
  const [ onlineFriendsData, setOnlineFriendsData ] = useState([]);
  const [ appUsers, setAppUsers ] = useState([]);
  const [ callRecieverId, setCallRecieverId ] = useState('');

  const [ calModal, setCallModal ] = useState(false);

  useEffect(()=>{

    async function fetchData(){
        try{
            const response = await axios.get(`${url}/conversation/${user?._id}`);
            setConversation(response.data);
        }catch(err){
            console.log(err);
        }
    };
if(user){

  fetchData();
}
},[convId, user?._id]);

useEffect(()=>{
  // const link = 'https://recruit-link-socket-server.onrender.com'
  socket.current = io('ws://localhost:8900', {
    query : {
      userId : user?._id,
      peerId : peerId && peerId
    }
  });


  socket.current.on('onlineUsers', (users) => {

    const mergedUsers = [...onlineFriends];
    users.forEach((user) => {
      if (!mergedUsers.some((existingUser) => existingUser.userId === user.userId)) {
        mergedUsers.push(user);
      }
    });
        console.log('online friends...', users);

    setOnlineFriends(mergedUsers);
  });

  return ()=>{
    socket.current.disconnect();
  };

},[peerId]);

useEffect(()=>{
  async function fetchData(){
    console.log('123',user);
    const body = {
      userId : user?._id,
      username : user?.username
    }
    const response = await axios.get(`${url}/users?userId=${user._id}`);
    setUser(response.data);
    console.log('321',response.data);
  };
if(user){
  fetchData();
}
},[]);

useEffect(()=>{

  const fetchData = async()=>{
    try{
      const response = await axios.get(`${url}/users/getAllUsers`);
      console.log('all app users...', response.data);
      setAppUsers(response.data);
    }catch(err){
      console.log(err);
    }
  }
  fetchData();
},[]);

useEffect(()=>{
  async function fetchData(){
    if( onlineFriends.length < 1 ){
      return;
    }else{
      for(let i = 0; i < onlineFriends.length ; i++){
        const response = await axios.get(`${url}/users/fetchUser/${onlineFriends[i].userId}`);
        console.log('for loop fetched..',response.data);
        setOnlineFriendsData((prevData)=> [...prevData, response.data]);
      }
    }
  };

  if(user){
    fetchData();
  }
},[onlineFriends]);

  return (
    <MyContext.Provider value={{ peer, peerId, user, setUser, isFetching, setIsFetching, conversation, setConversation,
    messages, setMessages, convId, setConvId, convProfilePic, setConvProfilePic, recipientId, setRecipientId,
    socket : socket.current, onlineFriendsData, appUsers, callRecieverId, setCallRecieverId, url }}>
      <Router>
        <Routes>
          <Route exact path='/' element={user ? <Home></Home> : <Login></Login>}></Route>
          <Route exact path='/profile/:username' element={<Profile></Profile>}></Route>
          <Route exact path='/login' element={user ? <Home></Home> : <Login></Login>}></Route>
          <Route exact path='/signup' element={<Register></Register>}></Route>
          <Route exact path='/createJobs' element={<JobMain></JobMain>}></Route>
          <Route exact path='/findJobs' element={<FindJobs></FindJobs>}></Route>
          <Route exact path='/jobDashboard' element={<JobDashboard></JobDashboard>}></Route>
          <Route exact path='/findjobs/applyjob' element={<ApplyJob></ApplyJob>}></Route>
          <Route exact path='/messages' element={<Message></Message>}></Route>
          <Route exact path='/appliedcandidate/sendmail' element={<SendMail></SendMail>}></Route>
          <Route exact path='/jobDashboard/appliedcandidates/:jobId' element={<AppliedCandidates/>}></Route>
          <Route exact path='/profile/:user/editProfile' element={user ? <EditProfile></EditProfile> : <Login></Login>}></Route>
          <Route exact path='/videoCall' element={<VideoCall></VideoCall>}></Route>
        </Routes>
      </Router>

    </MyContext.Provider>

  )
}

export default App