import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Navbar.css';
 
export default function Navbar() {
    const navigate = useNavigate();
    const isLoggedIn = !!localStorage.getItem("authToken");
    const token = localStorage.getItem("authToken");


    let userRoles = [];
    if (isLoggedIn) {
        try {
            const decodedToken = jwtDecode(token);
            userRoles = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || [];
        } catch (error) {
            console.error("Token decoding failed", error);
        }
    }

    const isAdmin = userRoles.includes('Admin');
    localStorage.setItem("Role",userRoles);
 
    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userEmail');
         localStorage.removeItem('userId')
         localStorage.removeItem('Role')
         ;
      
        navigate('/'); 
    };
 
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light custom-navbar fixed-top" style={{ color: 'blue' }}>
            <a className="navbar-brand" href="/">
                <i className="fas fa-plane-departure"></i> FBS
            </a>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav mr-auto">
                    <li className="nav-item">
                        <Link className="nav-link" to="/">Home</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/about">About Us</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/contact">Contact Us</Link>
                    </li>
                    {/* Conditional rendering for admin buttons */}
                    {isAdmin && (
                        <>
                            <li className="nav-item">
                                <Link className="nav-link" to="/getFlights">Get Flights</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/addFlights">Add Flight</Link>
                            </li>
                        </>
                    )}
                </ul>
                <ul className="navbar-nav ml-auto">
                    <li className="nav-item">
                        {isLoggedIn ? (
                            <div className="nav-link" onClick={handleLogout} style={{ cursor: 'pointer' }}>
                                <i className="fas fa-user-circle"></i> Logout
                            </div>
                        ) : (
                            <Link className="nav-link" to="/login">Login</Link>
                        )}
                    </li>
                    {isLoggedIn && (
                        <li className="nav-item">
                            <Link className="nav-link" to="/Profile">Profile</Link>
                        </li>
                    )}
                </ul>
            </div>
        </nav>
    );
}
 