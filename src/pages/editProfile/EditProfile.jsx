import React, { useContext, useState } from 'react';
import { Form, Button, Image } from 'react-bootstrap'; // Import Image from react-bootstrap for displaying images
import axios from 'axios';
import { useNavigate } from 'react-router-dom'
import './editProfile.css';
import { MyContext } from '../../context/AuthContext';
import CryptoJs from 'crypto-js'


const EditProfile = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [coverPic, setCoverPic] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null); // State to store profile image preview URL
  const [coverPreview, setCoverPreview] = useState(null); // State to store cover image preview URL

  const { user, setUser } = useContext(MyContext);
  const navigate = useNavigate();

  const secret = "i hate this fuckin world";

  const handleProfilePicChange = (event) => {
    const file = event.target.files[0];
    setProfilePic(file);
    setProfilePreview(URL.createObjectURL(file)); // Create a preview URL for the selected profile image
  };

  const handleCoverPicChange = (event) => {
    const file = event.target.files[0];
    setCoverPic(file);
    setCoverPreview(URL.createObjectURL(file)); // Create a preview URL for the selected cover image
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const formData = new FormData();
    formData.append('profilePic', profilePic);
    formData.append('coverPic', coverPic);

    try {
      const response = await axios.post('https://recruit-link-socket-backend.onrender.com/api/user/profile/edit', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization' : `Bearer ${localStorage.getItem('auth')}`
        }
      });
      console.log(response.data);
      setUser(response.data.user);
      const encryptedValue = CryptoJs.AES.encrypt(JSON.stringify(response.data.user), secret).toString();
      console.log(encryptedValue);
      localStorage.setItem('recruitLinkUser', encryptedValue);
      // Handle successful upload
    } catch (error) {
      console.error('Error uploading files:', error);
      // Handle error
    }
  };

  return (
    <div className="editProfileContainer">
      <div className="editProfileWrapper">
      <div className="editProfileLeft">
        <h1><b><strong>EDIT YOUR PROFILE PICS</strong></b></h1>
      </div>
      <div className="editProfileRight">
      <Form onSubmit={handleSubmit} id='editProfileForm'>
      <Form.Group controlId="profilePic" id='profilePic'>
        <Form.Label>Profile Picture</Form.Label>
        <Form.Control type="file" onChange={handleProfilePicChange} />
        {profilePreview && <Image src={profilePreview} alt="Profile Preview" width={200} height={200} className='mt-2'/>} {/* Display profile image preview */}
      </Form.Group>
      
      <Form.Group controlId="coverPic" id='profileCover'>
        <Form.Label>Cover Picture</Form.Label>
        <Form.Control type="file" onChange={handleCoverPicChange} />
        {coverPreview && <Image src={coverPreview} alt="Cover Preview" width={200} height={200} className='mt-2'/>} {/* Display cover image preview */}
      </Form.Group>
      
      <Button variant="primary" type="submit">
        Upload
      </Button>
    </Form>
      </div>
      </div>
    </div>
  );
};

export default EditProfile;
