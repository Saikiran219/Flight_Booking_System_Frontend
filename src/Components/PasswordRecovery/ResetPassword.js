import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import './ResetPassword.css'; // Ensure the path is correct

const ResetPassword = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  
  // Decode the token and email from the URL query parameters
  const token = query.get('token');
  const email = query.get('email');
  
  // Replace the space with + for token and email (if needed)
  const decodedToken = token ? token.replace(/ /g, '+') : ''; // replace spaces back to + sign
  const decodedEmail = email ? decodeURIComponent(email) : '';
  
  const navigate = useNavigate();
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    
    try {
      const response = await axios.post('https://localhost:7144/api/UserLogin/reset-password', {
        email: decodedEmail,
        token: decodedToken,
        password: newPassword  // Make sure this matches your backend expectation
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      toast.success(response.data.message);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
      toast.error("Error resetting password.");
    }
  };
  
  return (
    <div className="password-reset">
      <form onSubmit={handleSubmit}>
        <h2>Reset Password</h2>
        <p id="pq">This link expires in 30 Minutes</p>
        {error && <p className="error">{error}</p>}
        <div>
          <label>New Password:</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Confirm Password:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button id="btnq" type="submit">Reset Password</button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default ResetPassword;
