import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
 
export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [gender, setGender] = useState('');
    const [address, setAddress] = useState('');
    const [alternativeContactNumber, setAlternativeContactNumber] = useState('');
    const [generalError, setGeneralError] = useState(''); // General error for missing fields
    const [fieldErrors, setFieldErrors] = useState({
        name: '',
        email: '',
        password: '',
        phoneNumber: '',
        gender: '',
        address: '',
    });
    const [successMessage, setSuccessMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
 
    const validateName = (name) => /^[a-zA-Z\s]+$/.test(name);
    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const validatePassword = (password) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/.test(password);
    const validatePhoneNumber = (phoneNumber) => /^\d{10}$/.test(phoneNumber);
    const validateGender = (gender) => ['Male', 'Female', 'Other'].includes(gender);
    const validateAddress = (address) => address.trim() !== '';
 
    // Validate fields and return true if all are valid
    const validateFields = () => {
        const newFieldErrors = {
            name: !validateName(name) ? 'Name must contain only letters and spaces.' : '',
            email: !validateEmail(email) ? 'Invalid email address.' : '',
            password: !validatePassword(password) ? 'Password must be at least 6 characters long and include one uppercase letter, one lowercase letter, and one number.' : '',
            phoneNumber: !validatePhoneNumber(phoneNumber) ? 'Phone number must contain exactly 10 digits and only numbers' : '',
            gender: !validateGender(gender) ? 'Please select a valid gender.' : '',
            address: !validateAddress(address) ? 'Address is required.' : '',
        };
 
        setFieldErrors(newFieldErrors);
 
        // Return false if any required field has an error
        return !Object.values(newFieldErrors).some((error) => error !== '');
    };
 
    const handleRegister = async () => {
        // Clear previous messages
        setGeneralError('');
        setSuccessMessage('');
 
        // If fields are empty, show the general error and return
        if (!name || !email || !password || !phoneNumber || !gender || !address) {
            setGeneralError('Please fill in all fields.');
            return;
        }
 
        // Check individual field validations only if they are filled
        if (!validateFields()) {
            return; // Validation errors will already be set
        }
 
        const finalAlternativeContactNumber = alternativeContactNumber.trim() === '' ? '0' : alternativeContactNumber;
 
        const newUser = {
            name,
            email,
            password,
            phoneNumber,
            gender,
            address,
            alternativeContactNumber: finalAlternativeContactNumber,
        };
 
        try {
            const response = await fetch("https://localhost:7144/api/UserLogin/register", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newUser),
            });
 
            if (response.ok) {
                setSuccessMessage('Registration successful! Redirecting to login...');
                setTimeout(() => navigate('/login'), 2000);
            } else {
                const contentType = response.headers.get("content-type");
                if (contentType && contentType.includes("application/json")) {
                    const error = await response.json();
                    setGeneralError(error.message || 'Registration failed. Please try again.');
                } else {
                    const errorText = await response.text();
                    setGeneralError(errorText || 'Registration failed. Please try again.');
                }
            }
        } catch (err) {
            setGeneralError('Error registering');
            console.error(err);
        }
    };
 
    // Clear general error message when user starts typing in any field
    const handleFieldChange = (field, value, validator) => {
        setGeneralError(''); // Remove general error message on any change
        const newFieldErrors = { ...fieldErrors, [field]: validator(value) ? '' : fieldErrors[field] };
        setFieldErrors(newFieldErrors);
    };
 
    // ... (other parts of the code remain unchanged)
 
return (
    <div className="container mt-5">
        <h2>Register</h2>
 
        {/* Success Message */}
        {successMessage && <div className="alert alert-success">{successMessage}</div>}
 
        {/* Registration Form */}
        <div className="form-group">
            <label>Name</label>
            <input
                type="text"
                className="form-control"
                onChange={(e) => {
                    setName(e.target.value);
                    handleFieldChange('name', e.target.value, validateName);
                }}
                value={name}
                required
            />
            {/* Field-specific error message is not shown here on register click */}
            {fieldErrors.name && <div className="alert alert-danger">{fieldErrors.name}</div>}
        </div>
 
        <div className="form-group">
            <label>Email</label>
            <input
                type="email"
                className="form-control"
                onChange={(e) => {
                    setEmail(e.target.value);
                    handleFieldChange('email', e.target.value, validateEmail);
                }}
                value={email}
                required
            />
            {/* Field-specific error message is not shown here on register click */}
            {fieldErrors.email && <div className="alert alert-danger">{fieldErrors.email}</div>}
        </div>
 
        <div className="form-group">
            <label>Password</label>
            <div className="input-group">
                <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-control"
                    onChange={(e) => {
                        setPassword(e.target.value);
                        handleFieldChange('password', e.target.value, validatePassword);
                    }}
                    value={password}
                    required
                />
                <div className="input-group-append">
                    <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        <i className={showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'}></i>
                    </button>
                </div>
            </div>
            {/* Field-specific error message is not shown here on register click */}
            {fieldErrors.password && <div className="alert alert-danger">{fieldErrors.password}</div>}
        </div>
 
        <div className="form-group">
            <label>Phone Number</label>
            <input
                type="text"
                className="form-control"
                onChange={(e) => {
                    setPhoneNumber(e.target.value);
                    handleFieldChange('phoneNumber', e.target.value, validatePhoneNumber);
                }}
                value={phoneNumber}
                required
            />
            {/* Field-specific error message is not shown here on register click */}
            {fieldErrors.phoneNumber && <div className="alert alert-danger">{fieldErrors.phoneNumber}</div>}
        </div>
 
        <div className="form-group">
            <label>Gender</label>
            <select
                className="form-control"
                onChange={(e) => {
                    setGender(e.target.value);
                    handleFieldChange('gender', e.target.value, validateGender);
                }}
                value={gender}
                required
            >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
            </select>
            {/* Field-specific error message is not shown here on register click */}
            {fieldErrors.gender && <div className="alert alert-danger">{fieldErrors.gender}</div>}
        </div>
 
        <div className="form-group">
            <label>Address</label>
            <input
                type="text"
                className="form-control"
                onChange={(e) => {
                    setAddress(e.target.value);
                    handleFieldChange('address', e.target.value, validateAddress);
                }}
                value={address}
                required
            />
            {/* Field-specific error message is not shown here on register click */}
            {fieldErrors.address && <div className="alert alert-danger">{fieldErrors.address}</div>}
        </div>
 
        <div className="form-group">
            <label>Alternative Contact Number</label>
            <input
                type="text"
                className="form-control"
                onChange={(e) => setAlternativeContactNumber(e.target.value)}
                value={alternativeContactNumber}
            />
        </div>
 
        {/* Register Button */}
        <button className="btn btn-primary" onClick={handleRegister}>Register</button>
       
        {/* General Error Message - positioned here */}
        {generalError && <div className="alert alert-danger mt-2">{generalError}</div>}
    </div>
);
 
}
 
 
 
 
 
 
 
 