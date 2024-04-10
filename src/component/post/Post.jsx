import React, { useEffect, useState } from 'react'
import './post.css'
import axios from 'axios'
import { format } from 'timeago.js'
import { Link } from 'react-router-dom'
import { useContext } from 'react'
import { MyContext } from '../../context/AuthContext'
import { Button, Modal, InputGroup, FormControl } from 'react-bootstrap';
// import { AuthContext } from '../../context/AuthContext'
// import { Users } from '../../../dummyData'

function Post({post}) {
    const [like, setLike ] = useState(post.likes.length);
    const [ isLiked, setDisliked ] = useState(false);
    const [ users, setUsers ] = useState({});
    // const { user: currentUser } = useContext(AuthContext);
    const { user:currentUser } = useContext(MyContext);

  const [showFullScreen, setShowFullScreen] = useState(false);
  const [ fullScreenImage, setFullScreenImage ] = useState('');

  const [ postLikes, setPostLikes ] = useState([]);
  const [ isFetching, setIsFetching ] = useState(false);
  const [showLikeScreen, setShowLikeScreen] = useState(false);

  const [ comment, setComment ] = useState(null);
  const [ commentDetails, setCommentDetails ] = useState({});
  const [ allFetchedComments, setAllFetchedComments ] = useState([]);
  const [ showCommentScreen, setShowCommentScreen ] = useState(false);
  const [ commentFetching, setCommentFetching ] = useState(false);
  const [ shownCommentPost, setShownCommentPost ] = useState('');
  const [ startFetchComment, setStartFetchingComment ] = useState(false);

    useEffect(()=>{
        setDisliked(post.likes.some(like => like.userId === currentUser._id));
    },[currentUser._id, post.likes])
    const likeHandler = ()=>{
        console.log(currentUser.profilePicture);
        try{
            axios.put(`https://recruit-link-socket-backend.onrender.com/api/posts/${post._id}/like`, {
                userId : currentUser._id,
                username : currentUser.username,
                profilePic : currentUser.profilePicture ? currentUser.profilePicture : '/assets/person/avatar.png' })
        }catch(err){
            console.log(err)
        }
        setLike( isLiked ? like - 1 : like + 1)
        setDisliked(!isLiked)
    }

    useEffect(()=>{
        const fetchUsers = async ()=>{
            const response = await axios.get(`https://recruit-link-socket-backend.onrender.com/api/users?userId=${post?.userId}`);
            setUsers(response.data);
        };

        fetchUsers()
    },[post.userId]);

    const toggleFullScreen = (img) => {
        
        setFullScreenImage(img);
        setShowFullScreen(true);
      };
      
      const closeFullScreen = ()=>{
        setFullScreenImage('');
        setShowFullScreen(false);
      };

      const handleDisplayLikes = async  (post)=>{
        console.log(post);
        const id = post._id;
        setIsFetching(true);
        try{
          const response = await axios.get(`https://recruit-link-socket-backend.onrender.com/api/posts/${id}/getlikes`);
          console.log(response.data);
          setIsFetching(false);
          setPostLikes(response.data);
          setShowLikeScreen(true);
        }catch(err){
          setIsFetching(false);
          console.log(err);
        }
      }

      const closeLikeScreen = ()=>{
        setShowLikeScreen(false);
      };

      const handlePostComment = async (e)=>{
        e.preventDefault();

        console.log(e);

        try{

          const response = await axios.post(`https://recruit-link-socket-backend.onrender.com/api/posts/${shownCommentPost._id}/addcomment`, {
            userId : currentUser._id,
            username : currentUser.username,
            profilePic : currentUser.profilePicture,
            comment : comment
          });
          console.log(response);
          setAllFetchedComments((prevComment)=>
            [...prevComment, {
              userId : currentUser._id,
              username : currentUser.username,
              text : comment,
              updatedAt : Date.now(),
              profilePic : currentUser.profilePicture
            }]
          )
          setComment('');
        }catch(err){
          setCommentFetching(false);
          console.log('Error adding the comment!!', err);
        }
      };

      const closeCommentScreen = ()=>{
        setShownCommentPost('');
        setShowCommentScreen(false);
      };

      const handleShowComment = async (post)=>{
        console.log(post);
        console.log(currentUser);
        try{

          const response = await axios.get(`https://recruit-link-socket-backend.onrender.com/api/posts/${post._id}/getallcomments`);
          console.log(response);
          setAllFetchedComments(response.data);
          setShownCommentPost(post);
          console.log('fetchedComments : ', allFetchedComments)
        }catch(err){
          setCommentFetching(false);
          console.log('Error showing comments!!', err);
        }
        setShowCommentScreen(true);
      };

      useEffect(()=>{},[startFetchComment, setStartFetchingComment]);

  return (
    <div className="postContainer">
        <div className="postWrapper">
            <div className="postTop">
                <div className="postTopLeft">
                    <Link to={`/profile/${users.username}`} style={{textDecoration:"none"}}>
                    <img src={users.profilePicture || '/assets/person/avatar.png'} className='postProfileImg' alt="" />
                    </Link>
                    <span className="postUserName">{users.username}</span>
                    <span className="postDate">{format(post.createdAt)}</span>
                </div>
                <div className="postTopRight">
                <i className="fa-solid fa-ellipsis-vertical"></i>
                </div>
            </div>
            <div className="postCenter">
                <span className="postText">{post?.desc}</span>
                <img src={post.img} alt="" className='postImg' onDoubleClick={()=>toggleFullScreen(post.img)}/>
            </div>
            <div className="postBottom">
                <div className="postBottomLeft">
                    <img src="/assets/like.png" className='likeIcon'alt="" onClick={likeHandler}/>
                    <img src="/assets/heart.png" className='likeIcon'alt="" onClick={likeHandler}/>
                    <span className="postLikeCounter" onClick={()=>handleDisplayLikes(post)}>{like} People like it</span>
                </div>
                <div className="postBottomRight">
                    <span className="postCommentTest" onClick={()=>handleShowComment(post)}>{post.comment} Comments</span>
                </div>
            </div>
        </div>

        <Modal
        show={showFullScreen}
        onHide={closeFullScreen}
        dialogClassName="modal-90w"
        aria-labelledby="example-custom-modal-styling-title"
        centered
      >
        <Modal.Body>
          <img src={fullScreenImage} alt="Full Screen" className="img-fluid" />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeFullScreen}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>


      <Modal
        show={showLikeScreen}
        onHide={closeLikeScreen}
        dialogClassName="modal-90w"
        aria-labelledby="example-custom-modal-styling-title"
      >
         <Modal.Header>
          <h3 className='text-center'>Post Likes</h3>
        </Modal.Header>
        <Modal.Body style={{ overflowY : 'scroll', maxHeight : '60vh', backgroundColor : '#f0f2f5' }}>
          { postLikes.length > 0 ? ( 
            <ul style={{ listStyle : 'none', padding : 0, display : 'flex', flexDirection : 'column', rowGap : '10px'}}>
              { postLikes.map((post)=>(
            <li key={post._id} style={{listStyle:"none"}}>
              <div className="likedContainer" style={{padding : '10px'}}>
                <img src={post.profilePic} alt="profile-img" />
                <h6>{post.username}</h6>
                <p style={{ fontSize : '10px'}}>{format(post.createdAt)}</p>
              </div>
            </li>
          )) 
              }
              </ul>): 
          <h3>No Likes Yet</h3>
          }
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeLikeScreen}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>



      <Modal
        show={showCommentScreen}
        onHide={closeCommentScreen}
        dialogClassName="modal-90w"
        aria-labelledby="example-custom-modal-styling-title"
      >
         <Modal.Header>
          <h3 className='text-center'>Comments</h3>
        </Modal.Header>
        <Modal.Body style={{ overflowY : 'scroll', maxHeight : '60vh' }}>
          { allFetchedComments.length > 0 ? ( 
            <ul style={{ listStyle : 'none', padding : 0, display : 'flex', flexDirection : 'column', rowGap : '10px'}}>
              { allFetchedComments.map((comment, index)=>(
            <li key={index} style={{listStyle:"none"}}>
              <div className="commentContainer" style={{
                display : 'flex',
                columnGap : '10px',
                alignItems : 'center',
                padding : '10px'
              }}>


                <img src={comment.profilePic ? comment.profilePic : '/assets/person/avatar.png'} alt="profile-img" style={{
                  width : '40px',
                  height : '40px',
                  borderRadius : '100%',
                  objectFit : 'cover'
                }}/>
                    <div className="commentHeader">
                      <div className="commentDetails">
                        <h6>{comment.username}</h6>
                        <p style={{ fontSize : '10px'}}><b>{format(comment.createdAt)}</b></p>
                      </div>
                      <div style={{
                        maxWidth: '400px'
                      }} className='commentBody'>
                        <p>{comment.text}</p>
                      </div>
                    </div>




              </div>
            </li>
          )) 
              }
              </ul>): 
          <h3>No Comments Yet</h3>
          }
        </Modal.Body>
        <Modal.Footer>
  <InputGroup className="mb-3">
    <FormControl
      placeholder="Add Comment..."
      aria-label="Text input"
      aria-describedby="basic-addon2"
      onChange={(e)=>setComment(e.target.value)}
      maxLength={50}
      value={comment}
    />
    <Button variant="primary" onClick={handlePostComment}>Post</Button>
  </InputGroup>
</Modal.Footer>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeCommentScreen}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>




    </div>
  )
}

export default Post