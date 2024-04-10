import React, { useContext, useRef, useState } from 'react'
import './login.css'
import { loginCall } from '../../apiCalls.jsx'
import { MyContext } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios';
import CryptoJs from 'crypto-js'
// import { AuthContext } from '../../context/AuthContext';

function Login() {

    const email = useRef();
    const password = useRef();
    const navigate = useNavigate();

    const { user, setUser, isFetching, setIsFetching } = useContext(MyContext);

    const secret = "i hate this fuckin world";
    
    //errors
    const [ emailError, setEmailError ] = useState(null);
    const [ passwordError, setPasswordError ] = useState(null);

    const handleClick = async (e)=>{
        e.preventDefault();
        setIsFetching(true);
        setPasswordError(false);
        setEmailError(false);
        console.log(email.current.value);
        const emailValue = email.current.value;
        const passwordValue = password.current.value;
        
        try{
            const res = await axios.post('https://recruit-link-socket-backend.onrender.com/api/auth/login', {
                email : emailValue,
                password : passwordValue
            });
            setIsFetching(false);
            console.log(res.data);
            const response = await axios.get(`https://recruit-link-socket-backend.onrender.com/api/users?userId=${res.data.user._id}`);
            const userData = response.data;
            setUser(res.data.user);
            setUser(response.data.user);
            const encryptedValue = CryptoJs.AES.encrypt(JSON.stringify(res.data.user), secret).toString();
            console.log(encryptedValue);
            localStorage.setItem('recruitLinkUser', JSON.stringify(userData));
            localStorage.setItem('auth', JSON.stringify(res.data.token));
            // const decryptedValue = CryptoJs.AES.decrypt(encryptedValue, secret);
            // const final = JSON.parse(decryptedValue.toString(CryptoJs.enc.Utf8));
            // console.log(final);
            navigate('/');
            location.reload();
        }catch(err){
            if(err.response.data.includes('user not found!!')){
                setIsFetching(false);
                setEmailError('This Email is not Registered!!');
                return;
            }
            if(err.response.data.includes('wrong password!!')){
                setIsFetching(false);
                setPasswordError('Wrong Password!!');
                return;
            }
            }
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
            <div className="loginRight" onSubmit={handleClick}>
                <form className="loginBox">
                    <div>
                    <input type="email" placeholder='Email' className="loginInput" ref={email} required/>
                    { emailError && <p className='text-danger'>{emailError}</p>}
                    </div>
                    <div>
                    <input type="password" placeholder='Password' className="loginInput" minLength={8} ref={password} required/>
                    { passwordError && <p className='text-danger'>{passwordError}</p>}
                    </div>
                    <button className="loginButton" disabled={isFetching}>{isFetching ? 
                    <div class="spinner-border" role="status" style={{color:"white"}}>
                    <span class="visually-hidden">Loading...</span>
                  </div>
                    : "Log In"}</button>
                    <span className="loginForgot">Forgot Password</span>
                    <Link to='/signup' style={{textDecoration : 'none'}} className='text-center'>
                    <button className="loginRegisterButton">Create a New Account</button>
                    </Link>
                </form>
            </div>
        </div>
    </div>
  )
}

export default Login