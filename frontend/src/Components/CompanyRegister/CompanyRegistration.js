import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Components from './CompanyComponent';
import { useAuth } from '../../authContext';
import axios from 'axios';

const SignupComponent = ({ companySignIn: initialSignInState }) => {
  const navigate = useNavigate();
  const { login } = useAuth();

  // Local state to toggle between sign-in and sign-up
  const [companySignIn, setCompanySignIn] = useState(initialSignInState);

  // Toggle between sign-in and sign-up
  const toggleSign = useCallback(() => {
    setCompanySignIn((prev) => !prev);
    // Navigate to the corresponding route based on the new toggle state
    navigate(companySignIn ? '/company-register' : '/company-login');
  }, [companySignIn, navigate]);

  // State to manage form data
  const [formData, setFormData] = useState({
    companyName: '',
    ownerName: '',
    companySector: '',
    employerName: '',
    employerEmail: '',
    password: ''
  });

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle company sign-up
  const handleCompanySignUp = async () => {
    try {
      const response = await axios.post('http://ec2-3-110-29-65.ap-south-1.compute.amazonaws.com/api/company-signup', formData);
      console.log('Company signed up successfully:', response.data);
      // Clear form data after successful sign-up
      setFormData({
        companyName: '',
        ownerName: '',
        companySector: '',
        employerName: '',
        employerEmail: '',
        password: ''
      });
      navigate('/company-login');
    } catch (error) {
      if (error.response && error.response.status === 400 && error.response.data.message === 'Company already exists') {
        alert('Company already exists. Please use a different email.');
      } else {
        console.error('Error signing up:', error);
        alert('Error signing up. Please try again later.');
      }
    }
  };

  // Handle company login
  const handleCompanyLogin = async () => {
    try {
      const response = await axios.post('http://ec2-3-110-29-65.ap-south-1.compute.amazonaws.com/api/company-login', formData);
      console.log('Company logged in successfully:', response.data);
      login(); // Only call login on successful login
      navigate('/');
    } catch (error) {
      if (error.response && error.response.status === 404 && error.response.data.message === 'Company not found') {
        alert('Company not found. Please sign up first.');
        toggleSign(); // Switch to sign-up view
      } else {
        console.error('Error logging in:', error);
        alert('Error logging in. Please try again later.');
      }
    }
  };

  // Handle form submission
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    if (companySignIn) {
      await handleCompanyLogin();
    } else {
      await handleCompanySignUp();
    }
  };

  return (
    <div>
      {companySignIn ? (
        <Components.SignInContainer signinIn={companySignIn}>
          <Components.Form>
            <Components.Title>Sign in</Components.Title>
            <Components.Input 
              type='email' 
              placeholder='Employer Email' 
              name="employerEmail" 
              onChange={handleInputChange} 
              value={formData.employerEmail} 
            />
            <Components.Input 
              type='password' 
              placeholder='Password' 
              name="password" 
              onChange={handleInputChange} 
              value={formData.password} 
            />
            <Components.Anchor href='#'>Forgot your password?</Components.Anchor>
            <Components.Button onClick={handleFormSubmit}>Sign In</Components.Button>
          </Components.Form>
        </Components.SignInContainer>
      ) : (
        <Components.SignUpContainer signinIn={companySignIn}>
          <Components.Form>
            <Components.Title>Create Account</Components.Title>
            <Components.Input 
              type='text' 
              placeholder='Company Name' 
              name="companyName" 
              onChange={handleInputChange} 
              value={formData.companyName} 
            />
            <Components.Input 
              type='text' 
              placeholder='Owner Name' 
              name="ownerName" 
              onChange={handleInputChange} 
              value={formData.ownerName} 
            />
            <Components.Input 
              type='text' 
              placeholder='Company Sector' 
              name="companySector" 
              onChange={handleInputChange} 
              value={formData.companySector} 
            />
            <Components.Input 
              type='text' 
              placeholder='Employer Name' 
              name="employerName" 
              onChange={handleInputChange} 
              value={formData.employerName} 
            />
            <Components.Input 
              type='email' 
              placeholder='Employer Email' 
              name="employerEmail" 
              onChange={handleInputChange} 
              value={formData.employerEmail} 
            />
            <Components.Input 
              type='password' 
              placeholder='Password' 
              name="password" 
              onChange={handleInputChange} 
              value={formData.password} 
            />
            <Components.Button onClick={handleFormSubmit}>Sign Up</Components.Button>
          </Components.Form>
        </Components.SignUpContainer>
      )}

      <Components.OverlayContainer signinIn={companySignIn}>
        <Components.Overlay signinIn={companySignIn}>
          <Components.LeftOverlayPanel signinIn={companySignIn}>
            <Components.Title>Welcome Back!</Components.Title>
            <Components.Paragraph>
              To keep connected with us please login with your company info
            </Components.Paragraph>
            <Components.GhostButton onClick={toggleSign}>Sign In</Components.GhostButton>
          </Components.LeftOverlayPanel>

          <Components.RightOverlayPanel signinIn={companySignIn}>
            <Components.Title>Hello, Friend!</Components.Title>
            <Components.Paragraph>
              Enter your company details and start your journey with us
            </Components.Paragraph>
            <Components.GhostButton onClick={toggleSign}>Sign Up</Components.GhostButton>
          </Components.RightOverlayPanel>
        </Components.Overlay>
      </Components.OverlayContainer>
    </div>
  );
};

export default SignupComponent;
