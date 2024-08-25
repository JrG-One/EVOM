import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import {
  BrowserRouter as Router,
  Route,
  Routes
} from "react-router-dom";
import { Parallax } from "react-parallax";
import Navbar from "./Components/Navbar/Navbar";
import Hero from "./Components/Hero/Hero";
import Features from "./Components/Features/Features";
import InterviewPortal from "./Components/InterviewPortal/InterviewPortal";
import FAQ from "./Components/FAQ/FAQ";
import Footer from "./Components/Footer/Footer";
import InterviewWhizTerminal from "./Components/Terminal/Terminal";
import SignupComponent from "./Components/RegisterForm/Registrationform";
import CompanySignup from './Components/CompanyRegister/CompanyRegistration'
import Resources from "./Components/Resources/Resources";
import AboutUs from "./Components/AboutUs/AboutUs";
import InterviewPage from "./Components/PromptSection/PromptSection";
import { AuthProvider } from "./authContext"; // Import AuthProvider
import { faTruckMedical } from "@fortawesome/free-solid-svg-icons";

const App = () => {
  const [userData, setUserData] = useState({
    name: '',
    company: '',
    role: '',
    experience: '', 
    language: '',
  });

  useEffect(() => {
    // Function to handle storage event
    const handleStorageChange = (event) => {
      if (event.key === 'userData') {
        // Update userData state with the new value from local storage
        setUserData(JSON.parse(event.newValue));
      }
    };

    // Listen for storage events
    window.addEventListener('storage', handleStorageChange);
    // Retrieve userData from local storage on component mount
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }

    // Cleanup function
    return () => {
      // Remove the storage event listener on component unmount
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <React.StrictMode>
      <AuthProvider>
        <Router>
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Navbar />
                  <Parallax
                    strength={500}
                    style={{
                      height: "auto",
                      overflow: "hidden",
                      background: "linear-gradient(to right, #1a1a1a, #000033)",
                    }}
                  >
                    <div>
                      <Hero />
                      <Features />
                      <InterviewWhizTerminal />
                      <FAQ />
                      <Footer className="fixed-footer" />
                    </div>
                  </Parallax>
                </>
              }
            />
            <Route
              path="/aboutus"
              element={
                <>
                  <Navbar />
                  <AboutUs />
                  <Footer className="fixed-footer" />
                </>
              }
            />
            <Route
              path="/interview-portal"
              element={
                <>
                  <Navbar />
                  <InterviewPortal />
                  <Footer className="fixed-footer" />
                </>
              }
            />
            <Route
              path="/login"
              element={
                <>
                  <Navbar />
                  <SignupComponent signIn={true} />
                  <Footer className="fixed-footer" />
                </>
              }
            />
            <Route
              path="/register"
              element={
                <>
                  <Navbar />
                  <SignupComponent signIn={false} />
                  <Footer className="fixed-footer" />
                </>
              }
            />
            <Route
              path="/company-login"
              element={
                <>
                  <Navbar />
                  <CompanySignup signIn={true} />
                  <Footer className="fixed-footer" />
                </>
              }
            />
            <Route
              path="/company-register"
              element={
                <>
                  <Navbar />
                  <CompanySignup signIn={false} />
                  <Footer className="fixed-footer" />
                </>
              }
            />
            <Route
              path="/resource"
              element={
                <>
                  <Navbar />
                  <Resources />
                  <Footer className="fixed-footer" />
                </>
              }
            />
            <Route
              path="/prompt"
              element={
                <>
                  <Navbar />
                  <InterviewPage 
                  name= {userData.name}
                  targetCompany={userData.company}
                  experience={userData.experience}
                  role={userData.role}
                  preferredLanguage={userData.language}
                  isCoding={true}
                />
                </>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </React.StrictMode>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);

reportWebVitals();
