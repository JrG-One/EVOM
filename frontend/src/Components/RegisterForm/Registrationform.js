import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as Components from './Component';
import { useAuth } from '../../authContext';
import axios from 'axios';

const SignupComponent = ({ signIn }) => {
  const navigate = useNavigate();
  const { login } = useAuth();

  // Function to toggle between sign-in and sign-up parts
  const toggleSign = () => {
    if (signIn) {
      navigate('/register');
    } else {
      navigate('/login');
    }
  };

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignUp = async () => {
    try {
      const response = await axios.post('http://ec2-3-110-29-65.ap-south-1.compute.amazonaws.com/api/signup', formData);
      console.log('User signed up successfully:', response.data);
      
    } catch (error) {
      if (error.response && error.response.status === 400 && error.response.data.message === 'User already exists') {
        alert('Email already exists. Please use a different email.');
        
      } else {
        console.error('Error signing up:', error);
      }
    }
  };  

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://ec2-3-110-29-65.ap-south-1.compute.amazonaws.com/api/login', formData);
      console.log('User logged in successfully:', response.data);
      
    } catch (error) {
      if (error.response && error.response.status === 404 && error.response.data.message === 'User not found') {
        alert('Email not found. Please sign up first.');
        toggleSign(SignupComponent);
      } else {
        console.error('Error logging in:', error);

      }
    }
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (signIn) {
      handleLogin();
      login();
      navigate('/') 
    } else {
      handleSignUp();
      navigate('/login');
    }
  };  

  return (
    <div>
      {signIn ? (
        <Components.SignInContainer signinIn={signIn}>
          <Components.Form>
            <Components.Title>Sign in</Components.Title>
            <Components.Input type='email' placeholder='Email' name="email" onChange={handleInputChange} />
            <Components.Input type='password' placeholder='Password' name="password" onChange={handleInputChange} />
            <Components.Anchor href='#'>Forgot your password?</Components.Anchor>
            <Components.Button onClick={handleFormSubmit}>Sign In</Components.Button>
          </Components.Form>
        </Components.SignInContainer>
      ) : (
        <Components.SignUpContainer signinIn={signIn}>
          <Components.Form>
            <Components.Title>Create Account</Components.Title>
            <Components.Input type='text' placeholder='Name' name="name" onChange={handleInputChange} />
            <Components.Input type='email' placeholder='Email' name="email" onChange={handleInputChange} />
            <Components.Input type='password' placeholder='Password' name="password" onChange={handleInputChange} />
            <Components.Button onClick={handleFormSubmit}>Sign Up</Components.Button>
          </Components.Form>
        </Components.SignUpContainer>
      )}

      <Components.OverlayContainer signinIn={signIn}>
        <Components.Overlay signinIn={signIn}>
          <Components.LeftOverlayPanel signinIn={signIn}>
            <Components.Title>Welcome Back!</Components.Title>
            <Components.Paragraph>
              To keep connected with us please login with your personal info
            </Components.Paragraph>
            <Components.GhostButton onClick={toggleSign}>Sign In</Components.GhostButton>
          </Components.LeftOverlayPanel>

          <Components.RightOverlayPanel signinIn={signIn}>
            <Components.Title>Hello, Friend!</Components.Title>
            <Components.Paragraph>
              Enter Your personal details and start journey with us
            </Components.Paragraph>
            <Components.GhostButton onClick={toggleSign}>Sign Up</Components.GhostButton>
          </Components.RightOverlayPanel>
        </Components.Overlay>
      </Components.OverlayContainer>
    </div>
  );
};

export default SignupComponent;
