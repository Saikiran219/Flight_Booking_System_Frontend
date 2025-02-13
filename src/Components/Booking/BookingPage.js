import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axiosInstance from '../Authnticate/axiosInstance'; 
export default function BookingPage() {
    const location = useLocation();
    const { flight, passengers } = location.state || {};
    const classType = location.state?.classType || '';
    const navigate = useNavigate();
    const [passengerDetails, setPassengerDetails] = useState({});
    const [totalPrice, setTotalPrice] = useState(0);
    const [availableSeats, setAvailableSeats] = useState([]);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [error, setError] = useState(null);
    const [formErrors, setFormErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
  console.log(classType);

    const [cardDetails, setCardDetails] = useState({
        cardNumber: '',
        cardHolderName: '',
        cardExpiry: '',
        cvv: '',
    });
    const [cardErrors, setCardErrors] = useState({}); 

    useEffect(() => {
       
        const fetchAvailableSeats = async () => {
            try {
                const response = await axiosInstance.get(`/Flight/${flight.flightNumber}/available-seats?seatClass=${classType}`);
                setAvailableSeats(response.data);
                console.log("Fetched seats:", response.data);
            } catch (error) {
                setError('Error fetching available seats');
                console.error("Error fetching seats:", error);
            }
        };
 
        if (flight.flightNumber && classType) {
            fetchAvailableSeats();
        }
    }, [flight.flightNumber, classType]);
 
    const handleSeatChange = (index, seat) => {
        const updatedSelectedSeats = [...selectedSeats];
        updatedSelectedSeats[index] = seat;
        setSelectedSeats(updatedSelectedSeats);   
        calculateTotalPrice(updatedSelectedSeats);
    if (seat) {
        setFormErrors((prevErrors) => ({
            ...prevErrors,
            [`seatNumber${index}`]: undefined, // Clear the error for this seat
        }));
    }
    };
 
    // Initialize passenger details
    useEffect(() => {
        if (passengers > 0) {
            const initialPassengerDetails = {};
            for (let i = 0; i < passengers; i++) {
                initialPassengerDetails[i] = {
                    firstName: '',
                    lastName: '',
                    gender: '',
                    age: '',
                    phoneNumber: '',
                    address: '',
                    alternativeContactNumber: '0000000000', // Default value
                };
            }
            setPassengerDetails(initialPassengerDetails);
        }
    }, [passengers]);

    const handleInputChange = (index, field, value) => {
        setPassengerDetails((prevState) => ({
            ...prevState,
            [index]: {
                ...prevState[index],
                [field]: value,
            },
        }));
        setFormErrors((prevErrors) => ({
            ...prevErrors,
            [`${field}${index}`]: undefined, 
        }));
    };
   
     const handleCardInputChange = (field, value) => {
        let formattedValue = value;
        // Add dashes to card number after every 4 digits
        if (field === 'cardNumber') {
            formattedValue = value.replace(/\D/g, '').replace(/(.{4})/g, '$1-').trim();
            if (formattedValue.endsWith('-')) {
                formattedValue = formattedValue.slice(0, -1);  // Remove trailing dash
            }
        }

        // Add slash between MM and YY in card expiry
        if (field === 'cardExpiry') {
            formattedValue = value.replace(/\D/g, '').slice(0, 4);  // Allow only 4 digits (MMYY)
            if (formattedValue.length > 2) {
                formattedValue = `${formattedValue.slice(0, 2)}/${formattedValue.slice(2, 4)}`;  // Add `/` between MM and YY
            }
        }

        setCardDetails((prevDetails) => ({
            ...prevDetails,
            [field]: formattedValue,
        }));
           // Clear card error as soon as valid data is entered
           if (field === 'cardNumber' && value.replace(/\D/g, '').length >= 16) {
            setCardErrors(prevErrors => ({
                ...prevErrors,
                cardNumber: undefined,
            }));
        }

        if (field === 'cardExpiry' && value.replace(/\D/g, '').length >= 4) {
            setCardErrors(prevErrors => ({
                ...prevErrors,
                cardExpiry: undefined,
            }));
        }

        if (field === 'cvv' && value.length >= 3) {
            setCardErrors(prevErrors => ({
                ...prevErrors,
                cvv: undefined,
            }));
        }

        if (field === 'cardHolderName' && value.length > 0) {
            setCardErrors(prevErrors => ({
                ...prevErrors,
                cardHolderName: undefined,
            }));
        }
    };
 
    // Validate the form inputs
    const validateForm = () => {
        const errors = {};
        Object.keys(passengerDetails).forEach(index => {
            const passenger = passengerDetails[index];
            if (!passenger.firstName) errors[`firstName${index}`] = 'First Name is required';
            if (!passenger.lastName) errors[`lastName${index}`] = 'Last Name is required';
            if (!passenger.gender) errors[`gender${index}`] = 'Gender is required';
            if (!passenger.age || isNaN(passenger.age) || passenger.age < 1) errors[`age${index}`] = 'Valid age is required';
            if (!passenger.phoneNumber || !/^\d{10}$/.test(passenger.phoneNumber)) errors[`phoneNumber${index}`] = 'Phone number must be 10 digits';
            if (!passenger.address) errors[`address${index}`] = 'Address is required';
            if (!selectedSeats[index]?.seatNumber) errors[`seatNumber${index}`] = 'Seat selection is required';
        });
        return errors;
    };

    const validateCardDetails = () => {
        const errors = {};
        const cardNumberWithoutDashes = cardDetails.cardNumber.replace(/-/g, '');
        if (!/^\d{16}$/.test(cardNumberWithoutDashes)) {
            errors.cardNumber = 'Card number must be 16 digits';
        }
        if (!cardDetails.cardHolderName) {
            errors.cardHolderName = 'Cardholder name is required';
        }
        if (!/^\d{3}$/.test(cardDetails.cvv)) {
            errors.cvv = 'CVV must be 3 digits';
        }
        const cardExpiryWithoutSlash = cardDetails.cardExpiry.replace(/\//g, '');
        if (!/^\d{4}$/.test(cardExpiryWithoutSlash)) {
            errors.cardExpiry = 'Card expiry date must be in MM/YY format';
        }
        return errors;
    };
    
    const calculateTotalPrice = (updatedSelectedSeats) => {
        if (updatedSelectedSeats.length === 0) {
            setTotalPrice(0);
            return;
        }
        const total = updatedSelectedSeats.reduce((acc, seat) => {
            return acc + (seat ? seat.price || 0 : 0);  // Check if seat is defined and has a price
        }, 0);   
        setTotalPrice(total);
    };

    const handleBookingConfirmation = async (e) => {
        e.preventDefault();
    
        const errors = validateForm();
        const cardErrors = validateCardDetails();

        if (Object.keys(errors).length > 0 || Object.keys(cardErrors).length > 0) {
            setFormErrors(errors);
            setCardErrors(cardErrors);
            return;
        }
    
        try {
            setIsSubmitting(true);
            let userId = localStorage.getItem('userId');
            if (userId) {
               
                console.log('UserId:', userId);
            } else {
                throw new Error("UserId not found.");
            }
            
            const bookingDate = new Date().toISOString();
            const passengerData = Object.values(passengerDetails);
            const seatBookings = selectedSeats.map(seat => ({
                seatId:seat.seatId,
                seatNumber: seat.seatNumber,
                classType: flight.seatClass,
                seatPosition: seat.position,
                price:seat.price
            }));
    
            const bookingData = {
                flightId: flight.flightNumber,
                passengers: passengerData,  // Send the modified passenger data
                seatBookings,
                isPaid: true,
                userId: userId,
                bookingDate: bookingDate,
            };
    
            const response = await axiosInstance.post('https://localhost:7144/api/Booking/confirm', bookingData);
            const bookingId = response.data.bookingDetails.bookingId;
            const passengerIds = response.data.bookingDetails.passengers.map(p => p.passengerId);
            alert('Booking confirmed successfully!');
    
            navigate('/ticket', { state: { flight, passengers: passengerData,  seatBookings,totalPrice, bookingId, passengerIds } });
    
        } catch (error) {
            console.error('Error during booking confirmation:', error);
            alert('Failed to confirm the booking.');
        } finally {
            setIsSubmitting(false); // Re-enable button if necessary
        }
    };
    
    const renderPassengerForms = () => {
        const forms = [];
        for (let i = 0; i < passengers; i++) {
            forms.push(
                <div key={i} className="mb-3">
                    <h4>Passenger {i + 1}</h4>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>First Name</label>
                                <input
                                    type="text"
                                    className={`form-control ${formErrors[`firstName${i}`] ? 'is-invalid' : ''}`}
                                    onChange={(e) => handleInputChange(i, 'firstName', e.target.value)}
                                />
                                {formErrors[`firstName${i}`] && <div className="invalid-feedback">{formErrors[`firstName${i}`]}</div>}
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>Last Name</label>
                                <input
                                    type="text"
                                    className={`form-control ${formErrors[`lastName${i}`] ? 'is-invalid' : ''}`}
                                    onChange={(e) => handleInputChange(i, 'lastName', e.target.value)}
                                />
                                {formErrors[`lastName${i}`] && <div className="invalid-feedback">{formErrors[`lastName${i}`]}</div>}
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>Gender</label>
                                <select
                                    className={`form-control ${formErrors[`gender${i}`] ? 'is-invalid' : ''}`}
                                    onChange={(e) => handleInputChange(i, 'gender', e.target.value)}
                                >
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                                {formErrors[`gender${i}`] && <div className="invalid-feedback">{formErrors[`gender${i}`]}</div>}
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>Seat Number</label>
                                <select
                                    value={selectedSeats[i]?.seatNumber || ''}
                                    onChange={(e) => handleSeatChange(i, availableSeats.find(seat => seat.seatNumber === e.target.value))}
                                    className={`form-control ${formErrors[`seatNumber${i}`] ? 'is-invalid' : ''}`}
                                >
                                    <option value="">Select a seat</option>
                                    {availableSeats.map(seat => (
                                        <option
                                            key={seat.seatNumber}
                                            value={seat.seatNumber}
                                            disabled={selectedSeats.some(selected => selected?.seatNumber === seat.seatNumber)}
                                        >
                                            {seat.position} - {seat.seatNumber}
                                        </option>
                                    ))}
                                </select>
                                {formErrors[`seatNumber${i}`] && <div className="invalid-feedback">{formErrors[`seatNumber${i}`]}</div>}
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>Age</label>
                                <input
                                    type="number"
                                    className={`form-control ${formErrors[`age${i}`] ? 'is-invalid' : ''}`}
                                    onChange={(e) => handleInputChange(i, 'age', e.target.value)}
                                />
                                {formErrors[`age${i}`] && <div className="invalid-feedback">{formErrors[`age${i}`]}</div>}
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>Phone Number</label>
                                <input
                                    type="text"
                                    className={`form-control ${formErrors[`phoneNumber${i}`] ? 'is-invalid' : ''}`}
                                    onChange={(e) => handleInputChange(i, 'phoneNumber', e.target.value)}
                                />
                                {formErrors[`phoneNumber${i}`] && <div className="invalid-feedback">{formErrors[`phoneNumber${i}`]}</div>}
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>Address</label>
                                <input
                                    type="text"
                                    className={`form-control ${formErrors[`address${i}`] ? 'is-invalid' : ''}`}
                                    onChange={(e) => handleInputChange(i, 'address', e.target.value)}
                                />
                                {formErrors[`address${i}`] && <div className="invalid-feedback">{formErrors[`address${i}`]}</div>}
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>Alternative Contact Number (Optional)</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter if applicable"
                                    onChange={(e) => handleInputChange(i, 'alternativeContactNumber', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                    <hr />
                </div>
            );
        }
        return forms;
    };

    return (
        <div className="container mt-4 ">
            <h2>Booking Page</h2>
            <form onSubmit={handleBookingConfirmation}>
                {renderPassengerForms()}
                <div className="d-flex justify-content-between align-items-center mb-3">
                   <h4>Payment Information</h4>
                   <h4>Total Price: ${totalPrice}</h4>
            </div>
            <div className="row">
    <div className="col-md-6">
        <div className="form-group">
            <label>Card Number</label>
            <input
                type="text"
                className={`form-control ${cardErrors.cardNumber ? 'is-invalid' : ''}`}
                value={cardDetails.cardNumber}
                onChange={(e) => handleCardInputChange('cardNumber', e.target.value)}
            />
            {cardErrors.cardNumber && <div className="invalid-feedback">{cardErrors.cardNumber}</div>}
        </div>
    </div>
    <div className="col-md-6">
        <div className="form-group">
            <label>Cardholder Name</label>
            <input
                type="text"
                className={`form-control ${cardErrors.cardHolderName ? 'is-invalid' : ''}`}
                value={cardDetails.cardHolderName}
                onChange={(e) => handleCardInputChange('cardHolderName', e.target.value)}
            />
            {cardErrors.cardHolderName && <div className="invalid-feedback">{cardErrors.cardHolderName}</div>}
        </div>
    </div>
</div>
 
<div className="row">
    <div className="col-md-6">
        <div className="form-group">
            <label>Expiry Date</label>
            <input
                type="text"
                className={`form-control ${cardErrors.cardExpiry ? 'is-invalid' : ''}`}
                placeholder="MM/YY"
                value={cardDetails.cardExpiry}
                onChange={(e) => handleCardInputChange('cardExpiry', e.target.value)}
            />
            {cardErrors.cardExpiry && <div className="invalid-feedback">{cardErrors.cardExpiry}</div>}
        </div>
    </div>
    <div className="col-md-6">
        <div className="form-group">
            <label>CVV</label>
            <input
                type="text"
                className={`form-control ${cardErrors.cvv ? 'is-invalid' : ''}`}
                value={cardDetails.cvv}
                onChange={(e) => handleCardInputChange('cvv', e.target.value)}
            />
            {cardErrors.cvv && <div className="invalid-feedback">{cardErrors.cvv}</div>}
        </div>
    </div>
</div>
 
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                    {isSubmitting ? 'Processing...' : 'Confirm Booking'}
                </button>
            </form>
            {error && <p className="text-danger">{error}</p>}
         
        </div>
    );

}