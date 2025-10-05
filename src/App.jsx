import React from 'react'
import Navbar from './components/Navbar'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Home from './pages/Home';
import Profile from './pages/Profile';
import Error404 from './pages/Error404';
import SignInFirst from './pages/SignInFirst';
import Signup from './pages/Signup';
import Login from './pages/Login';
import PublicProfile from './pages/PublicProfile';
import Footer from './components/Footer';
import About from './pages/About';

const App = () => {

  // Function to check if user is logged in
  const isLoggedIn = () => {
    const userData = sessionStorage.getItem('userData');
    return !!userData; // returns true if userData exists, false otherwise
  };

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={isLoggedIn() ? <Profile /> : <SignInFirst />} />
        <Route path="/about" element={<About />} />

        {/* Add validation in PublicProfile or move it after the 404 */}
        

        <Route path="*" element={<Error404 />} />
        <Route path="/:userName" element={<PublicProfile />} />
      </Routes>
      <Footer/>
    </Router>
  )
}

export default App;
