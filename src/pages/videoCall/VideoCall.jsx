import React, { useEffect, useState, useRef, useContext } from 'react'
import { MyContext } from '../../context/AuthContext';
import { Button, Modal } from 'react-bootstrap'

function VideoCall() {

  const { peer, peerId, socket, conversation, user : currentUser } = useContext(MyContext);
  // const [peerId, setPeerId] = useState('');
  const [remotePeerIdValue, setRemotePeerIdValue] = useState('');
  const remoteVideoRef = useRef('');
  const currentUserVideoRef = useRef('');
  const peerInstance = useRef(null);

  const [ stream, setStream ] = useState('');

  const [ displayVideo, setDisplayVideo ] = useState(true);
  const [ shareAudio, setShareAudio ] = useState(true);

  const [ callAttended, setCallAttended ] = useState(false);

  const [ modalUser, setModalUser ] = useState(null);
  const [ showModal, setShowModal ] = useState(false);
  const [ isCalling, setIsCalling ] = useState(false);

  const [ attendedUser, setAttendedUser ] = useState('');

  const [ requestedPeer, setRequestedPeer ] = useState(false);

  const [ showCallModal, setCallModal ] = useState(false);

  useEffect(()=>{
    // const peer = new Peer();

    // peer.on('open', (id)=>{
    //   setPeerId(id);
    //   console.log('peer id', id);
    // });
    console.log(' hello from video call : ', peer, peerId, conversation);

    const initiateUserVideo = ()=>{
      var getUserMedia = navigator.getUserMedia || navigator.webKitGetUserMedia || navigator.mozGetUserMedia;

      getUserMedia({ video : true, audio : true }, (mediaStream)=>{
        currentUserVideoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
      })
    }
    initiateUserVideo();

    peerInstance.current = peer;
  },[peer, peerId]);

  useEffect(()=>{
    peer?.on('call', (call)=>{
      console.log('call recieved.........', call);

      // setCallModal(true);
      
      // if(callAttended){
      //   console.log('call attended...')
      var getUserMedia = navigator.getUserMedia || navigator.webKitGetUserMedia || navigator.mozGetUserMedia;

      getUserMedia({ video : true, audio : true}, (mediaStream)=>{
        currentUserVideoRef.current.srcObject = mediaStream;
        currentUserVideoRef.current.play();
        call?.answer(mediaStream);
        call?.on('stream', (remoteStream)=>{
          const userDetails = call.options.userDetails;
          console.log('User details:', userDetails);
          remoteVideoRef.current.srcObject = remoteStream;
          remoteVideoRef.current.play();
        })
      })
      // setCallModal(false);
      // }
    });
    peerInstance.current = peer;
  },[])

  const call = async (remotePeerId)=>{
    console.log('going to call,,,,,')

      console.log(remotePeerId);

      const userDetails = {
        userId : currentUser._id,
        username : currentUser.username,
        profilePic : currentUser.profilePic
      };

      const call = await peerInstance.current.call(remotePeerId, stream, { userDetails} );
      console.log(call);
      call?.on('stream', (remoteStream)=>{
        console.log(remoteStream);
        remoteVideoRef.current.srcObject = remoteStream;
        remoteVideoRef.current.play();
        setCallAttended(true);
      })
  };

  const handleModal = (user)=>{
    setModalUser(user);
    setShowModal(true);
  };

  const handleModalClose = ()=>{
    setModalUser('');
    setShowModal(false);
  };

  const handleCallAttended = ()=>{
    setAttendedUser(modalUser);
    setModalUser('');
    setShowModal(false);
  };

  const findPeer = (userId)=>{
    if(socket){
      socket?.emit('findPeer', { userId });
      setRequestedPeer(true);
    }
  };

  useEffect(()=>{
    socket?.on('findPeerResponse', (data)=>{
      setRemotePeerIdValue(data.msg);
      console.log(data);
      setRequestedPeer(false);
      if(data.msg.includes('user is not online')){
        alert('Your Friend is Not Online...');
      }else{
        call(remotePeerIdValue);
      }
    })
  },[requestedPeer]);

  const handleCallModalClose = ()=>{
    setCallModal(false);
  };
  
  const attendCall = ()=>{
   setCallAttended(true);
  }

  return (
    <div className="videoCallContainer">
      <div className="videoCallWrapper">
        <div className="videoCallHeader">
          <h1>RecruitLink</h1>
          <h3>Make Video Call With Your Friends</h3>
        </div>
        <div className="videoCallBody">
          <div className="videoCallBodyLeft">
            <div className="videoContainer">
            <video playsInline muted ref={currentUserVideoRef} autoPlay style={{ width : '600px', height : '600px' }} className='myVideo'/>
            <video playsInline ref={remoteVideoRef} style={{ width : '600px', height : '600px' }} className='remoteVideo'/>
            </div>
          </div>
          <div className="videoCallBodyRight">
            <div className="videoOptionsHeader">
            <h3>Start Video Call With Your Friends</h3>
            <input type="text" placeholder='Search Friends With UserName' />
            </div>
            <div className="videoOptionsBody">
              { conversation.length > 0 && 
              conversation.map((user, index)=>(
                <li key={index} style={{ listStyle : 'none'}}>
                  <div className="videoOptionsMember" onClick={()=>handleModal(user)}>
                    <img src={user.profilePic || '/assets/person/avatar.png'} alt="profile pic" style={{ width : '45px', height : '45px',  objectFit : 'cover', borderRadius : "50%"}}/>
                    <h5>{user.username}</h5>
                  </div>
                </li>
              ))
              }
            </div>
          </div>
        </div>
      </div>
      <h1>Current user id is {peerId}</h1>
      <input type="text" value={remotePeerIdValue} onChange={e => setRemotePeerIdValue(e.target.value)} />
      { !callAttended ? 
      <button onClick={() => call(remotePeerIdValue)}>Call</button>
      :
      <button onClick={()=> cutCall()}>Cut</button>
      }
      <div>
        <button>{ displayVideo ? 'Stop Video' : 'Start Video' }</button>
        <button>{ shareAudio ? 'Stop Audio' : 'Start Audio'}</button>
      </div>
      <div>
      </div>


       <Modal
        show={showModal}
        onHide={handleModalClose}
        dialogClassName="modal-90w"
        aria-labelledby="example-custom-modal-styling-title"
        centered
      >
        <Modal.Header>
          <h3><b>Make A video Call</b></h3>
        </Modal.Header>
        <Modal.Body className='modalBody'>
        <img src={modalUser?.profilePic || '/assets/person/avatar.png'} alt="profilePic" />
        <h5>{modalUser?.username}</h5>
        <Button variant='danger' onClick={()=>findPeer(modalUser.userId)}>Call User</Button>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            cancel
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showCallModal}
        onHide={handleCallModalClose}
        dialogClassName="modal-90w"
        aria-labelledby="example-custom-modal-styling-title"
        centered
      >
        <Modal.Header>
          <h3><b>Video Call From a Friendl</b></h3>
        </Modal.Header>
        <Modal.Body className='modalBody'>
        
        <Button variant='danger' onClick={()=>findPeer(modalUser.userId)}>Call User</Button>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='primary' onClick={attendCall}>Attend</Button>
          <Button variant="danger" onClick={handleCallModalClose}>
            Reject
          </Button>
        </Modal.Footer>
      </Modal>


    </div>
  )
}

export default VideoCall