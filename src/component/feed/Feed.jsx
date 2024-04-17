import React, { useContext, useEffect } from 'react'
import './feed.css'
import Share from '../share/Share'
import Post from '../post/Post'
import { useState } from 'react'
import axios from 'axios'
import { MyContext } from '../../context/AuthContext'
// import { AuthContext } from '../../context/AuthContext'
// import { Posts } from '../../../dummyData'

function Feed({home, username, admin}) {
  const [ posts , setPosts ] = useState([]);
  // const { user } = useContext(AuthContext);
  const { user, url } = useContext(MyContext);

  useEffect(()=>{
    const fetchPosts = async () =>{
      const response = username ? 
      await axios.get(`${url}/posts/profile/${username}`)
      : 
      await axios.get(`${url}/posts/timeline/${user._id}`);
      const sorted = response.data.sort((p1, p2)=>{
        return new Date(p2.createdAt) - new Date(p1.createdAt);
      })
      console.log(sorted);
      setPosts(sorted);
    };
    fetchPosts();
  },[username, user._id])
  return (
    <div className='feedContainer'>
      <div className="feedWrapper">
        { username == user.username && <Share></Share>}
        { posts.length > 0 ? 
        <div>
        { posts.map(p=>(
                  <Post key={p._id} post={p}></Post>
        ))}
        </div>
        :
        <div className='noTimelinePosts'>
          { username && admin && 
          <div className="noTimelinePostsBody d-flex flex-column justify-content-center align-items-center p-3">
          <h1>No Post to Show..</h1>
          <h3>Create New Post...</h3>
        </div>
        }
        { home && 
        <div className="noTimelinePostsBody d-flex flex-column justify-content-center align-items-center p-3">
        <h1>No Post to Show..</h1>
        <h3>Follow Friends to see their Post..</h3>
      </div>
      }
      { username && !admin && 
      <div className="noTimelinePostsBody d-flex flex-column justify-content-center align-items-center p-3">
      <h1>No Post to Show..</h1>
      <h3>User haven't post anything...</h3>
    </div>
    }
        </div>
        }
      </div>
    </div>
  )
}

export default Feed