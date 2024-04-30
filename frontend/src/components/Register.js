import axios from 'axios';
import React, { useState } from 'react';
import { Link } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.css';
import TaskButton from './TaskButton'; 
import "../styles/Register.css"

function Register(){

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [message,setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        //Frontend check password
        try {
          setMessage('');
          axiosPostData();
          
          // Reset form fields after successful submission
          setFormData({
            username: '',
            email: '',
            password: '',
            confirmPassword: ''
          });
        } catch (error) {
          console.error('Registration failed:', error);
        }
      };
    
    const axiosPostData = async() => {
        try{
            const response = await axios.post('http://localhost:8080/register',formData);
            setMessage(<p className='success'>{response.data.message}</p>);
        }
        catch(error){
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
                <h2>Register</h2>
                <form onSubmit={handleSubmit}>
                    <div className='mb-3'>
                        <label htmlFor="username">
                            <strong>Username</strong>
                        </label>
                        <input type="text" id="username" name="username" value={formData.username} onChange={handleChange} className='form-control rounded' required />
                    </div>
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
                    <div className='mb-3'> 
                    <label htmlFor="confirmPassword">
                        <strong>Confirm password</strong>
                    </label>
                    <input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className='form-control rounded' required />
                    </div>
                    {message}
                    <TaskButton text={'Submit'} type="submit" theme="wideButton"></TaskButton>                  
                </form>
                <p >Already have an account?</p>
                <Link to="/login">
                    <TaskButton text={'Login'} theme="wideButtonBright"></TaskButton>
                </Link>         
            </div>
        </div>
    )
}
export default Register;