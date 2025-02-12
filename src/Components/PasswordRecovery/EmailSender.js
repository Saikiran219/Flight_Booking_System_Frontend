//EmailSender.js
 
import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom'; // Change this line
import './EmailSender.css';
 
const EmailSender = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const[loading,setloading]=useState(false)
  const navigate = useNavigate(); // Change this line
 
  const handleChange = (e) => {
    setEmail(e.target.value);
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setloading(true);
 
    if (!email) {
      setError('Email cannot be empty');
      toast.error('Email cannot be empty');
      return;
    }
 
    try {
      const response = await axios.post('https://localhost:7144/api/UserLogin/send-reset-link',
        email, // Send the email directly as a string
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
 
      if (response.status === 200) {
        toast.success("Password reset email sent!");
        setError(''); // Clear any previous error message
      }
      console.log(response.data);
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.message || 'An error occurred. Please try again.');
      } else {
        setError('An unexpected error occurred. Please check your connection or try again later.');
      }
      toast.error("Error occurred");
    }
    finally{
      setloading(false)
    }
  };
 
  const handleClose = () => {
    navigate('/login'); // Change this line
  };
 
  return (
    <div className="recovery-container">
      <form onSubmit={handleSubmit} className="recovery-form">
        <button type="button" className="close-button-a" onClick={handleClose}>X</button>
        <h2>Password Recovery</h2>
        {error && <p className="error">{error}</p>}
 
        <div className="form-group pt-2">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={handleChange}
            placeholder='Please Enter Registered Email'
            required
          />
        </div>
 
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? (
            <span>Sending... <i className="fas fa-spinner fa-spin"></i></span>
          ) : (
            <span>Send Reset Link</span>
          )}
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};
 
export default EmailSender;
 
 