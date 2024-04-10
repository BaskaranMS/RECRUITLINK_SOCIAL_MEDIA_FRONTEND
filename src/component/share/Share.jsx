import React, { useContext, useRef, useState } from 'react'
import './share.css'
import { MyContext } from '../../context/AuthContext'
import axios from 'axios';

function Share() {

    // const { user } = useContext(AuthContext);
    const { user, isFetching, setIsFetching } = useContext(MyContext);

    const desc = useRef();
    const  [ file, setFile] = useState(null);
    const [ fileName, setFileName ] = useState('');

    const submitHandler = async (e)=>{
        e.preventDefault();
        setIsFetching(true);

        const formData = new FormData();
        formData.append('file', file);
        console.log(file);

        const postData = {
            userId : user._id,
            desc : desc.current.value,
        }

        try{
            const response = await axios.post('https://recruit-link-socket-backend.onrender.com/api/posts/upload',  formData , {
                headers : {
                    'Content-Type' : 'multipart/form-data',
                },
                params : postData
            });
            console.log('file uploaded!!', response);
            setIsFetching(false);
            window.location.reload();
        }catch(err){
            console.log('failed to upload!!', err);
            setIsFetching(false);
        }
    }
  return (
    <div className="shareContainer">
        <div className="shareWrapper">
            <div className="shareTop">
                <img src={user.profilePicture || "/assets/person/avatar.png"} className='shareProfileImg' alt="" />
                <input type="text" className='shareInput' ref={desc} placeholder={`Whats's in your mind ${user.username} ?`} />
            </div>
            <hr className='shareHr'/>
            <form className="shareBottom" onSubmit={submitHandler}>
                <div className="shareOptions">
                    <label htmlFor='file' className="shareOption">
                    <i className="fa-solid fa-photo-film" style={{color : 'red'}} id='shareIcon'></i>
                        <span className='shareOptionText'>Photo or Video</span>
                        <input style={{display : 'none'}} type="file"  id="file" accept='.jpeg,.png,.jpg' onChange={(e)=>{
                            setFile(e.target.files[0]) ; setFileName('1 File ')}}/>
                    </label>
                    <div className="shareOption">
                    <i className="fa-solid fa-tag" id='shareIcon' style={{color : 'blue'}}></i>
                        <span className='shareOptionText'>Tag</span>
                    </div>
                    <div className="shareOption">
                    <i className="fa-solid fa-location-dot" id='shareIcon' style={{color : 'green'}}></i>
                        <span className='shareOptionText'>Location</span>
                    </div>
                    <div className="shareOption">
                        <i className="fa-solid fa-face-smile" style={{color : 'rgb(245, 215, 49)'}}></i>
                        <span className='shareOptionText'>Feelings</span>
                    </div>
                    { fileName.length > 1 ?  fileName + 'is selected' : ''}
                </div>
                <button className="shareButton" type='submit'>
                    { isFetching ? 
                    <div className="spinner-border" role="status" style={{color:"white"}}>
                    <span className="visually-hidden">Loading...</span>
                  </div>
                    : 'Quick Share'}</button>
            </form>
        </div>
    </div>
  )
}

export default Share