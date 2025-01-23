import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Contact.css'; // Custom CSS file

const Contact = () => {
  return (
    <div className="container my-5">
      <div className="row">
        <div className="col-md-12 text-center">
          <h1 className="display-4 mb-4">Contact Us</h1>
          <p className="lead">We’re here to help! If you have any questions or need assistance with your flight booking, don’t hesitate to reach out to us.</p>
        </div>
        <div className="col-md-12">
          <div className="row">
            <div className="col-md-4 text-center mb-3">
              <h4>Customer Support</h4>
              <p>support@FlightBooking.com</p>
              <p>+1-800-123-4567</p>
              <p>Monday to Friday, 9 AM - 6 PM (EST)</p>
            </div>
            <div className="col-md-8">
              <h4>General Inquiries</h4>
              <p>Email us at <a href="mailto:info@yourdomain.com">Flightbookinginfo@domain.com</a> or use the contact form above.</p>
              {/* You can add a contact form here if needed */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
