import React, { useState, useEffect } from 'react';
import axiosInstance from '../Authnticate/axiosInstance';
import { useNavigate } from 'react-router-dom';
import './AddFlight.css'; 
 
const AddFlight = () => {
    const [airports, setAirports] = useState([]);
    const [airlines, setAirlines] = useState([]);
    const [flightDetails, setFlightDetails] = useState({
        departureAirportName: '',
        arrivalAirportName: '',
        airlineName: '',
        departureTime: '',
        arrivalTime: '',
        seats: [
            {
                seatNumber: '',
                seatPosition: '',
                classType: '',
                price: '',
                isAvailable: true
            }
        ],
        stops: []
    });
    const navigate = useNavigate();
 
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState('');
   
    const [errorMessages, setErrorMessages] = useState({
        airline: '',
        departureAirport: '',
        arrivalAirport: '',
        departureTime: '',
        arrivalTime: '',
        stopErrors: [],
        seatPriceErrors: []
    });
    const seatPositionOptions = ['Front', 'Middle', 'Back'];
    const classTypeOptions = ['Economy', 'Business'];
    useEffect(() => {
        // Fetch Airports
        const fetchAirports = async () => {
            try {
                const response = await axiosInstance.get('Airports');
                setAirports(response.data);
            } catch (error) {
                console.error('Error fetching airports:', error);
                setAlertMessage('Failed to fetch airports.');
                setAlertType('error');
            }
        };
 
        // Fetch Airlines
        const fetchAirlines = async () => {
            try {
                const response = await axiosInstance.get('Airlines');
                setAirlines(response.data);
            } catch (error) {
                console.error('Error fetching airlines:', error);
                setAlertMessage('Failed to fetch airlines.');
                setAlertType('error');
            }
        };
 
        fetchAirports();
        fetchAirlines();
    }, []);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFlightDetails({ ...flightDetails, [name]: value });
    
        // Clear field-specific errors
        setErrorMessages((prevErrors) => ({
            ...prevErrors,
            [name]: '', // Clear the specific error message for the field
        }));
    
        // Validate dynamically if both departure and arrival airports have the same name
        if (name === 'departureAirportName' || name === 'arrivalAirportName') {
            if (
                (name === 'departureAirportName' && value === flightDetails.arrivalAirportName) ||
                (name === 'arrivalAirportName' && value === flightDetails.departureAirportName)
            ) {
                setErrorMessages((prevErrors) => ({
                    ...prevErrors,
                    departureAirport: 'Departure and arrival airports cannot be the same'
                }));
            } else {
                // Clear the error messages if they are different
                setErrorMessages((prevErrors) => ({
                    ...prevErrors,
                    departureAirport: '',
                    arrivalAirport: '',
                }));
            }
        }
    
        // Validate time logic (departure ahead of current time, arrival after departure)
        if (name === 'departureTime' || name === 'arrivalTime') {
            const updatedTimes = {
                ...flightDetails,
                [name]: value
            };
    
            const departureTime = new Date(updatedTimes.departureTime);
            const arrivalTime = new Date(updatedTimes.arrivalTime);
            const currentTime = new Date();
    
            // Check if the departure time is at least one hour ahead of the current time
            const oneHourAhead = new Date(currentTime.getTime() + (60 * 60 * 1000)); // Current time + 1 hour
            if (!isNaN(departureTime) && departureTime < oneHourAhead) {
                setErrorMessages((prevErrors) => ({
                    ...prevErrors,
                    departureTime: 'Departure time must be at least one hour ahead of the current time',
                }));
            } else {
                setErrorMessages((prevErrors) => ({
                    ...prevErrors,
                    departureTime: '',
                }));
            }
    
            // Check if both times are set and valid
            if (!isNaN(departureTime) && !isNaN(arrivalTime)) {
                const timeDifference = (arrivalTime - departureTime) / (1000 * 60 * 60); // Difference in hours
    
                if (timeDifference <= 1) {
                    setErrorMessages((prevErrors) => ({
                        ...prevErrors,
                        arrivalTime: 'Arrival time must be more than one hour after the departure time',
                    }));
                } else {
                    setErrorMessages((prevErrors) => ({
                        ...prevErrors,
                        arrivalTime: '',
                    }));
                }
            }
        }
    };
  
 
    const handleSeatChange = (index, e) => {
        const { name, value } = e.target;
        const updatedSeats = [...flightDetails.seats];
        updatedSeats[index] = { ...updatedSeats[index], [name]: value };
        setFlightDetails({ ...flightDetails, seats: updatedSeats });
         // Clear price-specific error
         if (name === 'price') {
            const seatPriceErrors = [...errorMessages.seatPriceErrors];
            seatPriceErrors[index] = parseFloat(value) <= 0 ? 'Price must be greater than zero' : '';
            setErrorMessages({ ...errorMessages, seatPriceErrors });
        }
 
    };
 
    const addSeat = () => {
        if (flightDetails.seats.length >= 200) {
            alert("You cannot add more than 200 seats.");
            return;
        }
        setFlightDetails({
            ...flightDetails,
            seats: [...flightDetails.seats, { seatNumber: '', seatPosition: '', classType: '', price: '', isAvailable: true }]
        });
        setErrorMessages({ ...errorMessages, seatPriceErrors: [...errorMessages.seatPriceErrors, ''] }); // Initialize error for new seat
    };
 
    const removeSeat = (index) => {
        // Prevent removal if it's the last seat
        if (flightDetails.seats.length > 1) {
            const updatedSeats = [...flightDetails.seats];
            updatedSeats.splice(index, 1);
            setFlightDetails({ ...flightDetails, seats: updatedSeats });
 
 
            const updatedErrors = [...errorMessages.seatPriceErrors];
            updatedErrors.splice(index, 1);
            setErrorMessages({ ...errorMessages, seatPriceErrors: updatedErrors });
 
        }    
    };
 
    const addStop = () => {
        if (flightDetails.stops.length >= 3) {
            alert("You cannot add more than 3 stops.");
            return;
        }
        setFlightDetails({
            ...flightDetails,
            stops: [...flightDetails.stops, { stopAirportName: '', stopTime: '' }]
        });
        setErrorMessages({ ...errorMessages, stopErrors: [...errorMessages.stopErrors, ''] }); // Initialize error for new stop
    };
 
    const removeStop = (index) => {
        const updatedStops = [...flightDetails.stops];
        updatedStops.splice(index, 1);
        setFlightDetails({ ...flightDetails, stops: updatedStops });
       
        const updatedErrors = [...errorMessages.stopErrors];
        updatedErrors.splice(index, 1);
        setErrorMessages({ ...errorMessages, stopErrors: updatedErrors });
 
    };
 
    const handleStopChange = (index, e) => {
        const { name, value } = e.target;
        const updatedStops = [...flightDetails.stops];
        updatedStops[index] = { ...updatedStops[index], [name]: value };
        setFlightDetails({ ...flightDetails, stops: updatedStops });
        const updatedErrors = [...errorMessages.stopErrors];
        if (name === 'stopAirportName') {
            if (value === flightDetails.departureAirportName || value === flightDetails.arrivalAirportName) {
                updatedErrors[index] = 'Stop airport cannot be the same as departure or arrival airport';
            } else {
                if (!updatedErrors[index] || updatedErrors[index] !== 'Stop time must be between departure and arrival times') {
                    updatedErrors[index] = ''; 
                }
            }
        }
    
        if (name === 'stopTime') {
            const stopTime = new Date(value);
            const departureTime = new Date(flightDetails.departureTime);
            const arrivalTime = new Date(flightDetails.arrivalTime);
    
            if (stopTime <= departureTime || stopTime >= arrivalTime) {
                updatedErrors[index] = 'Stop time must be between departure and arrival times';
            } else {
                if (!updatedErrors[index] || updatedErrors[index] !== 'Stop airport cannot be the same as departure or arrival airport') {
                    updatedErrors[index] = ''; 
                }
            }
        }
    
        setErrorMessages({ ...errorMessages, stopErrors: updatedErrors });
    };
     
    const validateFields = () => {
        const errors = {
            airline: '',
            departureAirport: '',
            arrivalAirport: '',
            departureTime: '',
            arrivalTime: '',
            stopErrors: [],
           seatPriceErrors: []
        };
 
     
         // Validate departure airport
    if (!flightDetails.departureAirportName) {
        errors.departureAirport = 'Departure airport is required';
    } else if (flightDetails.departureAirportName === flightDetails.arrivalAirportName) {
        errors.departureAirport = 'Departure and arrival airports cannot be the same';
    }
 
    // Validate arrival airport
    if (!flightDetails.arrivalAirportName) {
        errors.arrivalAirport = 'Arrival airport is required';
    }
        if (!flightDetails.departureTime) {
            errors.departureTime = 'Departure time is required';
        } else if (new Date(flightDetails.departureTime) <= new Date()) {
            errors.departureTime = 'Departure time must be greater Than One Hour of present timne  ';
        }
        if (!flightDetails.arrivalTime) {
            errors.arrivalTime = 'Arrival time is required';
        } else if (new Date(flightDetails.arrivalTime) <= new Date(flightDetails.departureTime)) {
            errors.arrivalTime = 'Arrival time must be more Than one Hour of  departure time';
        }
 
        flightDetails.seats.forEach((seat, index) => {
            if (!seat.price || parseFloat(seat.price) <= 0) {
                errors.seatPriceErrors[index] = 'Price must be greater than zero';
            } else {
                errors.seatPriceErrors[index] = '';
            }
        });
 
        flightDetails.stops.forEach((stop, index) => {
            if (!stop.stopAirportName) {
                errors.stopErrors[index] = 'Stop airport name is required';
            } else if (stop.stopAirportName === flightDetails.departureAirportName || stop.stopAirportName === flightDetails.arrivalAirportName) {
                errors.stopErrors[index] = 'Stop airport cannot be the same as departure or arrival airport';
            }
            if (!stop.stopTime) {
                errors.stopErrors[index] = errors.stopErrors[index] || 'Stop time is required';
            } else if (new Date(stop.stopTime) <= new Date(flightDetails.departureTime) || new Date(stop.stopTime) >= new Date(flightDetails.arrivalTime)) {
                errors.stopErrors[index] = errors.stopErrors[index] || 'Stop time must be between departure and arrival times';
            }
        });
 
        setErrorMessages(errors);
        return Object.values(errors).every(msg => msg === '' || (Array.isArray(msg) && msg.every(m => m === '')));
    };
 
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateFields()) {
            return;
        }
       
        try {
            const response = await axiosInstance.post('Flight/Add', flightDetails);
            console.log('Flight added successfully:', response.data);
           
            alert('Flight details Added successfully');
             navigate(`/getFlights`);
           
        } catch (error) {
            console.error('Error adding flight:', error);
            alert('Error adding flight. Please try again later.');
        }
    };
 
    return (
        <div className="add-flight-container">
             <h2 className="form-title">Add Flight</h2> 
            {alertMessage && (
                <div className={`alert ${alertType}`}>{alertMessage}</div>
            )}
            <form onSubmit={handleSubmit} className="flight-form">
                <div className="form-row">
                    <div className="form-group">
                        <label className="form-label">Departure Airport</label>
                        <select className="form-select" name="departureAirportName" onChange={handleChange} required>
                            <option value="">Select Airport</option>
                            {airports.map((airport) => (
                                <option key={airport.id} value={airport.name}>{airport.name}</option>
                            ))}
                        </select>
                        {errorMessages.departureAirport && <div className="error-message">{errorMessages.departureAirport}</div>}
                    </div>
 
                    <div className="form-group">
                        <label className="form-label">Arrival Airport</label>
                        <select className="form-select" name="arrivalAirportName" onChange={handleChange} required>
                            <option value="">Select Airport</option>
                            {airports.map((airport) => (
                                <option key={airport.id} value={airport.name}>{airport.name}</option>
                            ))}
                        </select>
                        {errorMessages.arrivalAirport && <div className="error-message">{errorMessages.arrivalAirport}</div>}
                    </div>
                </div>
 
                <div className="form-group">
                    <label className="form-label">Airline</label>
                    <select className="form-select" name="airlineName" onChange={handleChange} required>
                        <option value="">Select Airline</option>
                        {airlines.map((airline) => (
                            <option key={airline.airlineId} value={airline.airlineName}>
                                {airline.airlineName}
                            </option>
                        ))}
                    </select>
                    {errorMessages.airline && <div className="error-message">{errorMessages.airline}</div>}
                </div>
 
                <div className="form-row">
                    <div className="form-group">
                        <label className="form-label">Departure Time</label>
                        <input type="datetime-local" className="form-input" name="departureTime" onChange={handleChange} min={new Date().toISOString().slice(0, 16)} required />
                        {errorMessages.departureTime && <div className="error-message">{errorMessages.departureTime}</div>}
                    </div>
 
                    <div className="form-group">
                        <label className="form-label">Arrival Time</label>
                        <input type="datetime-local" className="form-input" name="arrivalTime" onChange={handleChange} min={new Date().toISOString().slice(0, 16)} required />
                        {errorMessages.arrivalTime && <div className="error-message">{errorMessages.arrivalTime}</div>}
                    </div>
                </div>
 
                <h3 className="section-title">Seats</h3>
                {flightDetails.seats.map((seat, index) => (
                    <div key={index} className="seat-row">
                        <div className="form-group">
                            <label className="form-label">Seat Number</label>
                            <input type="text" className="form-input" name="seatNumber" value={seat.seatNumber} onChange={(e) => handleSeatChange(index, e)} required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Seat Position</label>
                            <select className="form-select" name="seatPosition" value={seat.seatPosition} onChange={(e) => handleSeatChange(index, e)} required>
                                <option value="">Select Position</option>
                                {seatPositionOptions.map(option => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Class Type</label>
                            <select className="form-select" name="classType" value={seat.classType} onChange={(e) => handleSeatChange(index, e)} required>
                                <option value="">Select Class</option>
                                {classTypeOptions.map(option => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
            <label className="form-label">Price</label>
            <input
                type="number"
                className="form-input"
                name="price"
                value={seat.price}
                onChange={(e) => handleSeatChange(index, e)}
                required
            />
            <div><small>{errorMessages.seatPriceErrors[index] && (
                <span className="error-message">{errorMessages.seatPriceErrors[index]}</span>)}</small>
             </div>
        </div>
                        {index > 0 && (
                            <button type="button" className="remove-btn" onClick={() => removeSeat(index)}>X</button>
                        )}
                    </div>
                ))}
                <button type="button" className="add-btn" onClick={addSeat}>Add Seat</button>
 
                <h3 className="section-title">Stops</h3>
                {flightDetails.stops.map((stop, index) => (
                    <div key={index} className="stop-row">
                        <div className="stop-row1">
                        <div className="form-group">
                            <label className="form-label">Stop Airport</label>
                            <select className="form-select" name="stopAirportName" value={stop.stopAirportName} onChange={(e) => handleStopChange(index, e)}>
                                <option value="">Select Stop Airport</option>
                                {airports.map((airport) => (
                                    <option key={airport.id} value={airport.name}>{airport.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Stop Time</label>
                            <input type="datetime-local" className="form-input" name="stopTime" value={stop.stopTime} onChange={(e) => handleStopChange(index, e)} min={new Date().toISOString().slice(0, 16)} />
                        </div>
                       
                        <div><button type="button" className="remove-btn" onClick={() => removeStop(index)}>X</button></div> </div>
                        <p>{errorMessages.stopErrors[index] && <div className="error-message">{errorMessages.stopErrors[index]}</div>}</p>
                     
                    </div>
                   
                ))}
                <button type="button" className="add-btn" onClick={addStop}>Add Stop</button>
 
                <button type="submit" className="submit-button">Add Flight</button>
            </form>
        </div>
    );
};
 
export default AddFlight;