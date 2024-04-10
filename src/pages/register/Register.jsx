import React, { useContext, useRef, useState } from 'react'
import './register.css'
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'
import { MyContext } from '../../context/AuthContext';
import  validator  from 'validator'
import { Modal, Button } from 'react-bootstrap'
// const validator = require('validator');

function Register() {

    const username = useRef();
    const email = useRef();
    const password = useRef();
    const cPassword = useRef();
    const otp = useRef();

    const navigate = useNavigate();

    const { user, setUser } = useContext(MyContext);

    const [otpSent, setOtpSent] = useState(false);
    const [isfetching, setIsfetching] = useState(false);
    const [ otpVerified, setOtpVerified ] = useState(false);

    //error display
    const [emailError, setEmailError] = useState(null);
    const [ otpError, setOtpError ] = useState(null);
    const [ passwordError, setPasswordError ] = useState(null);
    const [ cPasswordError, setCpasswordError ] = useState(null);
    const [ usernameError, setUsernameError ] = useState(null);

    //modal display
    const [ modalDisplay, setModalDisplay ] = useState(false);
    const [ modalTitle, setModalTitle ] = useState('RecruitLink Registration');
    const [ modalBody, setModalBody ] = useState('Successfully Registered!!');

    const handleClick = async (e) => {
        e.preventDefault();
        setIsfetching(true);
        setUsernameError(null);
        setPasswordError(null);
        setCpasswordError(null);
        if(username.current.value.length < 1 ){
            setIsfetching(false);
            setUsernameError('Please Enter Username!!');
            return;
        }
        if(username.current.value.length < 6 ){
            setIsfetching(false);
            setUsernameError('Username Should be atleast 6 Chars long!!');
            return;
        }
        if(password.current.value < 1 ){
            setIsfetching(false);
            setPasswordError('Please Enter Password!!');
            return;
        }
        if(password.current.value < 8 ){
            setIsfetching(false);
            setPasswordError('Password Should be Atleast 8 Chars long!!');
            return;
        }
        if(cPassword.current.value.length < 1 ){
            setIsfetching(false);
            setCpasswordError('Please Enter Confirm Password!!');
            return;
        }
        if (password.current.value != cPassword.current.value) {
            setIsfetching(false);
            password.current.setCustomValidity("Passwords doesn't match!");
            setCpasswordError("Password's Doesn't Match!!");
        } else {
            const user = {
                username: username.current.value,
                password: password.current.value,
                token : localStorage.getItem('signup')
            };
            try {
                const res = await axios.post('https://recruit-link-socket-backend.onrender.com/api/auth/register', user);
                console.log(res.data);
                setIsfetching(false);
                setModalDisplay(true);
            } catch (err) {
                setIsfetching(false);
                console.log(err)
            }
        }
    }

    const sendOtp = async (e) => {
        e.preventDefault();
        if(email.current.value.length < 1 ){
            setEmailError('Please Enter Email!!');
            return;
        }
        if(!validator.isEmail(email.current.value)){
            setEmailError('Please Enter Valid Email Address!!');
            return;
        }
        setIsfetching(true);
        try {
            const res = await axios.post(`https://recruit-link-socket-backend.onrender.com/api/email/sendotp/${email.current.value}`);
            console.log(res);
            localStorage.setItem('signup', res.data.token);
            setIsfetching(false);
            setOtpSent(true);
            email.current.value = ''
        } catch (err) {
            if(err.response.data.includes('user is already registered!!')){
                setIsfetching(false);
                console.log('ho')
                email.current.setCustomValidity('This Email is Already Registered!!');
                setEmailError('This Email is Already Registered!!');
            }else{
                console.log(err)
            }
        }
    }

    const verifyOtp = async (e) => {
        e.preventDefault();
        setIsfetching(true);

        console.log(otp.current.value);
        
        const otpValue = otp.current.value;
        if(otpValue.length < 1){
            setIsfetching(false);
            setOtpError('Please Enter Otp!!');
            return;
        }
        try{
            const res = await axios.post('https://recruit-link-socket-backend.onrender.com/api/email/verifyotp', {
                value : otpValue,
                token : localStorage.getItem('signup')
            })
            setIsfetching(false);
            console.log(res);
            if(res.data.includes('valid otp!!')){
                setOtpVerified(true);
            }
        }catch(err){
            console.log(err);
            if(err.response.data.includes('invalid otp!!')){
                setIsfetching(false);
                setOtpError('Please Enter Valid Otp!!');
            }
        }
    }

    const handleModalClose = ()=>{
        navigate('/login');
    }
    return (
        <div className="loginContainer">
            <div className="loginWrapper">
                <div className="loginLeft">
                    <h3 className="loginLogo">RecruitLink</h3>
                    <span className="loginDesc">
                        Connect to the peoples around the World
                    </span>
                </div>
                <div className="loginRight">
                    <form className="loginBox">
                        { !otpVerified ?
                        <>
                        {otpSent ?
                        <div>
                                                        <input type="text" ref={otp} placeholder='Enter OTP Sent to your email!!' className="loginInput" required />
                                                        {otpError ? <p className='text-danger'>{otpError}</p> : '' }
                        </div>
                            :
                            <div>
                                <input type="email" placeholder='Enter Your Email' ref={email} className="loginInput" required />
                                {emailError ? <p className='text-danger'>{emailError}</p> : ''}
                            </div>
                        }
                        {otpSent ?
                            <button className="loginButton" onClick={verifyOtp}>
                                {isfetching ?
                                    <div class="spinner-border" role="status" style={{ color: "white" }}>
                                        <span class="visually-hidden">Loading...</span>
                                    </div>
                                    :
                                    'Verify Otp'}</button>
                            :
                            <button className="loginButton" onClick={sendOtp}>
                                {isfetching ?
                                    <div class="spinner-border" role="status" style={{ color: "white" }}>
                                        <span class="visually-hidden">Loading...</span>
                                    </div>
                                    :
                                    'Send Otp'}</button>
                        }
                        </> : ''}
                        {otpVerified ?
                            <>
                            <div>
                            <input type="text" placeholder='userName' ref={username} className="loginInput" required/>
                            {usernameError && <p className='text-danger'>{usernameError}</p>}
                            </div>
                            <div>
                            <input type="password" placeholder='Password' ref={password} className="loginInput" required minLength={8}/>
                            {passwordError && <p className='text-danger'>{passwordError}</p>}
                            </div>
                            <div>
                            <input type="password" placeholder='Confirm Password' ref={cPassword} className="loginInput" required />
                    {cPasswordError ? <p className='text-danger'>{cPasswordError}</p> : ''}
                            </div>
                    <button className="loginButton" onClick={handleClick}>Sign Up</button>
                        </> : ''}
                        <Link to='/login' style={{textDecoration : 'none'}} className='text-center'>
                        <button className="loginRegisterButton">Log into Account</button>
                        </Link>
                    </form>
                </div>
            </div>
            { modalDisplay && 
            <Modal show={modalDisplay} onHide={handleModalClose} centered>
            <Modal.Header closeButton>
              <Modal.Title>{modalTitle}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {modalBody}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleModalClose}>
                LogIn
              </Button>
              {/* You can add additional buttons here */}
            </Modal.Footer>
          </Modal>
            }
        </div>
    )
}

export default Register