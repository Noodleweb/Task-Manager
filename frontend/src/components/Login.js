import axios from 'axios';
import React, { useState } from 'react';
import { Link } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.css';
import TaskButton from './TaskButton'; 
import "../styles/Register.css"
import { useNavigate } from 'react-router-dom';
import { useSignIn } from "react-auth-kit";

function Login(){
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [message,setMessage] = useState('');
    const navigate = useNavigate();
    const signIn = useSignIn()
    

    const handleLogin = async(e) => {
        e.preventDefault();
        try{
            setMessage('');
            axiosPostData();
            setFormData({
                email: '',
                password: ''
              });
        }catch(error){
            console.error('Login failed:', error);
        }

    };

    const axiosPostData = async() => {
        try{
            const response = await axios.post('http://localhost:8080/login',formData);
            
            if (response.status === 200) {
                console.log('Login successful');
                localStorage.setItem('token', response.data.token); 
                navigate('/dashboard');
            }
            
           
           signIn({
            token:response.data.token,
            expiresIn:3600,
            tokenType:'Bearer',
            authState:{email:formData.email}
            });
            
        }
        catch(error){
            console.error('Error:', error);
            setMessage(<p className='fail'>{error.response.data.error}</p>);
        }
    };

    const handleChange = (e) => {
        setFormData({
        ...formData,
        [e.target.name]: e.target.value
        });
    };
    return (
        <div className="d-flex justify-content-center align-items-center vh-100" style={{backgroundColor: '#F0EBD8'}}> 
        <div className="bg-white p-3 rounded col-10 col-sm-8 col-md-6 col-lg-4">
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <div className='mb-3'>
                <label htmlFor="email">
                    <strong>Email</strong>
                </label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className='form-control rounded' required />
                </div>
                <div className='mb-3'>
                <label htmlFor="password">
                    <strong>Password</strong>
                </label>
                <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} className='form-control rounded' required />
                </div>
                {message}
                <TaskButton text={'Login'} type="submit" theme="wideButton"></TaskButton>                  
            </form>
            <p >Create an account?</p>
            <Link to="/register">
                <TaskButton text={'Register'} theme="wideButtonBright"></TaskButton>
            </Link>         
        </div>
    </div>
    )
}
export default Login;