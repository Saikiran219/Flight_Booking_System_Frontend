import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './About.css'; // Custom CSS file

const About = () => {
  return (
    <div className="container my-5">
      <div className="row">
        <div className="col-md-12 text-center">
          <h1 className="display-4 mb-4">About Us</h1>
          <p className="lead">
            Welcome to <strong> Flight Booking System</strong>,  for seamless air travel planning. Our platform provides an intuitive and user-friendly interface to search, compare, and book flights across a multitude of airlines.
          </p>
          <p>
            With our advanced algorithms, you get the best deals tailored to your preferences and budget. Whether you're booking a flight for business or Economy, our goal is to make your travel experience as smooth and enjoyable as possible.
          </p>
          <p>
            Fly smart, travel happy!
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
