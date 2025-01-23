import React from 'react';
import './Footer.css'; // Assuming your CSS file is named Footer.css

function Footer() {
  return (
    <>
      <div className="footer ">
        <div className="lists">
          <div>          
            <ul>
              <li className="lih2">ABOUT US</li>
              <li>About Us</li>
              <li>Careers</li>
              <li>Media Centre</li>
              <li>Our Planet</li>
              <li>Our People</li>
              <li>Our Communities</li>
            </ul>
          </div>
          <div>
            <ul>
              <li className="lih2">HELP</li>
              <li>Help and Contact</li>
              <li>Travel Updates</li>
              <li>Special Assistance</li>
              <li>FAQs</li>
            </ul>
          </div>
          <div>          
            <ul>
              <li className="lih2">BOOK & MANAGE</li>
              <li>Book Flights</li>
              <li>Travel Services</li>
              <li>Planning Your Trip</li>
              <li>Check-in</li>
              <li>Manage Your Booking</li>
            </ul>
          </div>
          <div>
            <ul>
              <li className="lih2">TRAVEL INFORMATION</li>
              <li>Baggage</li>
              <li>Visa & Passport Info</li>
              <li>Health</li>
              <li>Flight Status</li>
              <li>To and From the Airport</li>
            </ul>
          </div>
        </div>
        <div className="logo">
        <i className="fas fa-plane-departure" style={{fontSize:'2rem'}}></i>
        </div>
        <div className="icons">
          <div>
            <h3 style={{color:'white'}}>FOLLOW US</h3>
            <a href="https://www.facebook.com/"target='blank'><img src={`${process.env.PUBLIC_URL}/facebook.png`} alt="Facebook Icon" /></a>
            <a href="https://www.instagram.com/" target='blank'><img src={`${process.env.PUBLIC_URL}/instagram.png`} alt="Instagram Icon" /></a>
            <a href="https://x.com/?lang=en-in" target='blank'><img src={`${process.env.PUBLIC_URL}/twitter.png`} alt="Twitter Icon" /></a>
          </div>
          <div>
            <h3 style={{color:'white'}}>EXPERIENCE FBS ONLINE</h3>
            <img className="iconsimg2"
              src={`${process.env.PUBLIC_URL}/gplay.png`}
              alt="Google Play"
              width="100px"
              height="40px"
            />
            <img className="iconsimg2"
              src={`${process.env.PUBLIC_URL}/appStore.png`}
              alt="Apple App Store"
              width="100px"
              height="40px"
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Footer;
