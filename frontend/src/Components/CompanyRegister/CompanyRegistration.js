<<<<<<< Updated upstream
import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Components from './CompanyComponent';
import { useAuth } from '../../authContext';
=======
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as Components from './CompanyComponent'; // Adjust import as needed
import { useAuth } from '../../authContext'; // Import your auth context
>>>>>>> Stashed changes
import axios from 'axios';

const SignupComponent = ({ companySignIn: initialSignInState }) => {
  const navigate = useNavigate();
  const { login } = useAuth();

<<<<<<< Updated upstream
  // Local state to toggle between sign-in and sign-up
  const [companySignIn, setCompanySignIn] = useState(initialSignInState);
=======
  // Function to toggle between sign-in and sign-up parts
  const toggleSign = () => {
    navigate(CompanysignIn ? '/company-register' : '/company-login');
  };
>>>>>>> Stashed changes

  // Toggle between sign-in and sign-up
  const toggleSign = useCallback(() => {
    setCompanySignIn((prev) => !prev);
    // Navigate to the corresponding route based on the new toggle state
    navigate(companySignIn ? '/company-register' : '/company-login');
  }, [companySignIn, navigate]);

  // State to manage form data
  const [formData, setFormData] = useState({
<<<<<<< Updated upstream
    companyName: '',
    ownerName: '',
    companySector: '',
    employerName: '',
    employerEmail: '',
=======
    Companyname: '',
    Ownername: '',
    CompanySector: '',
    Employername: '',
    Employeremail: '',
>>>>>>> Stashed changes
    password: ''
  });

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
<<<<<<< Updated upstream
    setFormData((prev) => ({ ...prev, [name]: value }));
=======
    setFormData(prev => ({ ...prev, [name]: value }));
>>>>>>> Stashed changes
  };

  // Handle company sign-up
  const handleCompanySignUp = async () => {
    try {
<<<<<<< Updated upstream
      const response = await axios.post('http://ec2-3-110-29-65.ap-south-1.compute.amazonaws.com/api/company-signup', formData);
      console.log('Company signed up successfully:', response.data);
      // Clear form data after successful sign-up
      setFormData({
        companyName: '',
        ownerName: '',
        companySector: '',
        employerName: '',
        employerEmail: '',
=======
      // const response = await axios.post('http://ec2-3-110-29-65.ap-south-1.compute.amazonaws.com/api/company-register', formData);
      const response = await axios.post('http://localhost:5000/api/companyregister', formData, {
        headers: { 'Content-Type': 'application/json' }
      });
      console.log('Company signed up successfully:', response.data);
      // Clear form data after successful sign-up
      setFormData({
        Companyname: '',
        Ownername: '',
        CompanySector: '',
        Employername: '',
        Employeremail: '',
>>>>>>> Stashed changes
        password: ''
      });
      navigate('/company-login');
    } catch (error) {
      if (error.response && error.response.status === 400 && error.response.data.message === 'Company already exists') {
        alert('Company already exists. Please use a different email.');
      } else {
        console.error('Error signing up:', error);
<<<<<<< Updated upstream
        alert('Error signing up. Please try again later.');
=======
      }
    }
  };

  const handleLogin = async () => {
    try {
      // const response = await axios.post('http://ec2-3-110-29-65.ap-south-1.compute.amazonaws.com/api/company-login', formData);
      const response = await axios.post('http://localhost:5000/api/companylogin', formData);

      console.log('Company logged in successfully:', response.data);
      login(); // Only call login on successful login
      navigate('/');
    } catch (error) {
      if (error.response && error.response.status === 404 && error.response.data.message === 'Company not found') {
        alert('Company not found. Please sign up first.');
        toggleSign();
      } else {
        console.error('Error logging in:', error);
>>>>>>> Stashed changes
      }
    }
  };

<<<<<<< Updated upstream
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
=======
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    if (CompanysignIn) {
      await handleLogin();
    } else {
      await handleSignUp();
    }
  };
>>>>>>> Stashed changes

  return (
    <div>
      {companySignIn ? (
        <Components.SignInContainer signinIn={companySignIn}>
          <Components.Form>
            <Components.Title>Sign in</Components.Title>
<<<<<<< Updated upstream
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
=======
            <Components.Input
              type='text'
              placeholder='Company Name'
              name="Companyname"
              value={formData.Companyname}
              onChange={handleInputChange}
            />
            <Components.Input
              type='email'
              placeholder='Employer Email'
              name="Employeremail"
              value={formData.Employeremail}
              onChange={handleInputChange}
            />
            <Components.Input
              type='password'
              placeholder='Password'
              name="password"
              value={formData.password}
              onChange={handleInputChange}
>>>>>>> Stashed changes
            />
            <Components.Anchor href='#'>Forgot your password?</Components.Anchor>
            <Components.Button onClick={handleFormSubmit}>Sign In</Components.Button>
          </Components.Form>
        </Components.SignInContainer>
      ) : (
        <Components.SignUpContainer signinIn={companySignIn}>
          <Components.Form>
            <Components.Title>Create Account</Components.Title>
<<<<<<< Updated upstream
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
=======
            <Components.Input
              type='text'
              placeholder='Company Name'
              name="Companyname"
              value={formData.Companyname}
              onChange={handleInputChange}
            />
            <Components.Input
              type='text'
              placeholder='Owner Name'
              name="Ownername"
              value={formData.Ownername}
              onChange={handleInputChange}
            />
            <Components.Input
              type='text'
              placeholder='Company Sector'
              name="CompanySector"
              value={formData.CompanySector}
              onChange={handleInputChange}
            />
            <Components.Input
              type='text'
              placeholder='Employer Name'
              name="Employername"
              value={formData.Employername}
              onChange={handleInputChange}
            />
            <Components.Input
              type='email'
              placeholder='Employer Email'
              name="Employeremail"
              value={formData.Employeremail}
              onChange={handleInputChange}
            />
            <Components.Input
              type='password'
              placeholder='Password'
              name="password"
              value={formData.password}
              onChange={handleInputChange}
>>>>>>> Stashed changes
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
