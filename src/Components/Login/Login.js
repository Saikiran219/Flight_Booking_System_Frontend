// Login.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Login.css';
 
export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const navigate = useNavigate();
 
    const validateFields = () => {
        let isValid = true;
        setEmailError('');
        setPasswordError('');
 
        // Email validation
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            setEmailError('Email is required.');
            isValid = false;
        } else if (!emailPattern.test(email)) {
            setEmailError('Invalid email format.');
            isValid = false;
        }
 
        // Password validation
        if (!password) {
            setPasswordError('Password is required.');
            isValid = false;
        } else if (password.length < 6) {
            setPasswordError('Password must be at least 6 characters long.');
            isValid = false;
        }
 
        return isValid;
    };
 
    const handleLogin = async () => {
        if (!validateFields()) {
            return;
        }
 
        const userCredentials = { email, password };
 
        try {
            const response = await axios.post("https://localhost:44339/api/UserLogin/login", userCredentials, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
 
            if (response.data.token) {
                localStorage.setItem('authToken', response.data.token);
                localStorage.setItem('userEmail', email);
                localStorage.setItem('userId', response.data.userId);
 
                // Check if the email matches the admin email
                if (email === 'spanchagiri684@gmail.com') {
                    localStorage.setItem('isAdmin', 'true'); // Set admin flag
                    navigate('/'); // Redirect to Home
                } else {
                    localStorage.removeItem('isAdmin'); // Ensure admin flag is removed for non-admins
                    navigate('/'); // Redirect to Home
                }
            } else {
                setErrorMessage('Login failed. Please check your credentials or Register by clicking below button');
            }
        } catch (err) {
            if (err.response) {
                setErrorMessage(err.response.data.message || ' Invalid Credentials Login failed. Please try again.');
            } else if (err.request) {
                setErrorMessage('Error logging in. Please check your network connection and try again.');
            } else {
                setErrorMessage('An unexpected error occurred. Please try again.');
            }
            console.error('Login error:', err);
        }
    };
 
    return (
        <div className="login-container">
            <div className="login-content">
                <h2>Login</h2>
                {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        className="form-control"
                        onChange={(e) => {
                            setEmail(e.target.value);
                            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                            if (emailPattern.test(e.target.value)) {
                                setEmailError(''); // Clear email error
                                setErrorMessage(''); // Clear general error
                            }
                        }}

                        value={email}
                        required
                    />
                    {emailError && <div className="alert alert-danger">{emailError}</div>}
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input
                        type="password"
                        className="form-control"
                        onChange={(e) => {
                            setPassword(e.target.value);
                            if (e.target.value.length >= 6) {
                                setPasswordError(''); // Clear password error
                                setErrorMessage(''); // Clear general error
                            }
                        }}
                        value={password}
                        required
                    />
                    {passwordError && <div className="alert alert-danger">{passwordError}</div>}
                </div>
                <div className="text-center">
                    <button className="btn btn-primary btn-wide" onClick={handleLogin}>Login</button>
                </div>
                <div className="text" style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
                    <span>New To Website?</span>
                    <Link to="/Register" className="register-link" style={{ marginLeft: '0.5rem' }}>
                        Register
                    </Link>
                </div>
                <div className="text" style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
                    <Link to="/EmailSender" className="forgot-password-link">
                        Forgot Password ?
                    </Link>
                </div>
            </div>
        </div>
    );
}
 