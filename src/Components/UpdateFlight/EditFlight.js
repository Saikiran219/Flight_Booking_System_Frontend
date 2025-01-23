import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './EditFlightPage.css'; // Ensure this CSS file contains the styles
 
const EditFlightPage = () => {
  const { flightId } = useParams();
  const navigate = useNavigate();
 
  const [flightDetails, setFlightDetails] = useState(null);
  const [seatDetails, setSeatDetails] = useState([]);
  const [originalSeatDetails, setOriginalSeatDetails] = useState([]);
  const [stopDetails, setStopDetails] = useState([]);
  // const [airlines, setAirlines] = useState([]);
  const [airports, setAirports] = useState([]);
 
 
  const [originalAirline, setOriginalAirline] = useState('');
 
  const [errors, setErrors] = useState({
    flight: {},
    seats: {},
    stops: {},
  });
 
  useEffect(() => {
    const fetchFlightDetails = async () => {
      try {
        const response = await axios.get(`https://localhost:44339/api/Flight/${flightId}`);
        setFlightDetails(response.data);
        setSeatDetails(response.data.seats);
        setOriginalSeatDetails(response.data.seats);
        setStopDetails(response.data.stops);
        setOriginalAirline(response.data.airline);
      } catch (error) {
        console.error('Error fetching flight details:', error);
      }
    };
 
 
    const fetchAirports = async () => {
      try {
        const response = await axios.get('https://localhost:44339/api/Airports');
        setAirports(response.data);
      } catch (error) {
        console.error('Error fetching airports:', error);
      }
    };
 
    fetchFlightDetails();
  //  fetchAirlines();
    fetchAirports();
  }, [flightId]);
 
  const handleFlightChange = (e) => {
    const { name, value } = e.target;
 
    // Update flight details
    setFlightDetails((prevDetails) => ({
        ...prevDetails,
        [name]: value,
    }));
 
    // Clear field-specific error messages for the flight fields
    setErrors((prevErrors) => ({
        ...prevErrors,
        flight: {
            ...prevErrors.flight,
            [name]: '', // Clear error message for this field
        },
    }));
 
    // Validate departure and arrival airports to ensure they are not the same
    if (name === 'departureAirport' || name === 'arrivalAirport') {
        const departureAirport = name === 'departureAirport' ? value : flightDetails.departureAirport;
        const arrivalAirport = name === 'arrivalAirport' ? value : flightDetails.arrivalAirport;
 
        if (departureAirport === arrivalAirport && departureAirport !== '') {
            // Set error message if they are the same
            setErrors((prevErrors) => ({
                ...prevErrors,
                flight: {
                    ...prevErrors.flight,
                    departureAirport: 'Departure and arrival airports cannot be the same',
                   // arrivalAirport: 'Departure and arrival airports cannot be the same', // Ensure to set the error here too
                },
            }));
        } else {
            // Clear error messages if they are different
            setErrors((prevErrors) => ({
                ...prevErrors,
                flight: {
                    ...prevErrors.flight,
                    departureAirport: '',
                    arrivalAirport: '',
                },
            }));
        }
    }
 
    // Validate departure and arrival times
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
            setErrors((prevErrors) => ({
                ...prevErrors,
                flight: {
                    ...prevErrors.flight,
                    departureTime: 'Departure time must be at least one hour ahead of the current time',
                },
            }));
        } else {
            setErrors((prevErrors) => ({
                ...prevErrors,
                flight: {
                    ...prevErrors.flight,
                    departureTime: '',
                },
            }));
        }
 
        // Check if both times are set and valid
        if (!isNaN(departureTime) && !isNaN(arrivalTime)) {
            const timeDifference = (arrivalTime - departureTime) / (1000 * 60 * 60); // Difference in hours
 
            if (timeDifference <= 1) {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    flight: {
                        ...prevErrors.flight,
                        arrivalTime: 'Arrival time must be more than one hour after the departure time',
                    },
                }));
            } else {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    flight: {
                        ...prevErrors.flight,
                        arrivalTime: '',
                    },
                }));
            }
        }
    }
  };
 
  const handleGroupedSeatChange = (classType, e) => {
    const { value } = e.target;
    const newPrice = parseFloat(value); // Convert input value to a number
 
    // Log the current seat details and errors for debugging
    console.log("Current seat details:", seatDetails);
    console.log("Current errors state:", errors);
 
    // Update the seat details for the classType being changed
    const updatedSeats = seatDetails.map((seat) =>
        seat.seatClass === classType ? { ...seat, price: newPrice } : seat
    );
 
    setSeatDetails(updatedSeats);
 
    // Ensure that the error structure exists for the classType
    const updatedErrors = {
        ...errors.seats,
        [classType]: {
            ...errors.seats[classType], // Create or preserve existing properties
            price: '' // Reset the price error for this classType
        }
    };
 
    // Validate the price - it must be greater than zero
    if (newPrice <= 0) {
        updatedErrors[classType].price = 'Price must be greater than zero';
    }
 
    // Validate business class price is greater than economy class price
    const economySeat = updatedSeats.find(seat => seat.seatClass === 'Economy');
    const businessSeat = updatedSeats.find(seat => seat.seatClass === 'Business');
 
    // Check if economy and business seats exist before comparing
    if (economySeat && businessSeat) {
        // Check if the current class type is Economy
        if (classType === 'Economy') {
            if (newPrice >= businessSeat.price) {
                updatedErrors[classType].price = 'Economy class price must be less than business class price';
            }
        } else if (classType === 'Business') {
            if (newPrice <= economySeat.price) {
                updatedErrors[classType].price = 'Business class price must be greater than economy class price';
            }
        }
    }
 
    // Log the updated errors for debugging
    console.log("Updated errors state:", updatedErrors);
 
    // Set the updated errors in the state
    setErrors((prevErrors) => ({
        ...prevErrors,
        seats: updatedErrors,
    }));
};
 
  const handleStopChange = (index, e) => {
    const { name, value } = e.target;
 
    // Update stop details based on the index and the field being changed
    const updatedStops = stopDetails.map((stop, stopIndex) =>
        stopIndex === index ? { ...stop, [name]: value } : stop
    );
    setStopDetails(updatedStops);
 
    // Clear the corresponding error message for the stop
    const updatedErrors = { ...errors.stops };
 
    // Clear existing errors for the current stop
    updatedErrors[index] = { ...updatedErrors[index], [name]: '' };
 
    // Validate airport name against departure and arrival airports
    if (name === 'airportName') {
        if (value === flightDetails.departureAirport || value === flightDetails.arrivalAirport) {
            updatedErrors[index].airportName = 'Stop airport cannot be the same as departure or arrival airport';
        }
    }
 
    // Validate stop time to ensure it falls between departure and arrival times
    if (name === 'stopDuration') {
        const stopTime = new Date(value);
        const departureTime = new Date(flightDetails.departureTime);
        const arrivalTime = new Date(flightDetails.arrivalTime);
 
        if (stopTime <= departureTime || stopTime >= arrivalTime) {
            updatedErrors[index].stopDuration = 'Stop time must be between departure and arrival times';
        }
    }
 
    // Set the errors in the state for stops
    setErrors((prevErrors) => ({
        ...prevErrors,
        stops: updatedErrors,
    }));
};
 
 
  const groupedSeats = seatDetails.reduce((acc, seat) => {
    if (!acc[seat.seatClass]) {
      acc[seat.seatClass] = { classType: seat.seatClass, price: seat.price };
    }
    return acc;
  }, {});
 
 
  const validateInputs = () => {
    const newErrors = { flight: {}, seats: {}, stops: {} };
 
    if (!flightDetails.departureAirport) {
      newErrors.flight.departureAirport = 'Departure airport is required.';
    }else if (flightDetails.departureAirport === flightDetails.arrivalAirport) {
      newErrors.flight.departureAirport = 'Departure and arrival airports cannot be the same.';
    }
 
    if (!flightDetails.arrivalAirport) {
      newErrors.flight.arrivalAirport = 'Arrival airport is required.';
    }
 
    if (!flightDetails.departureTime) {
      newErrors.flight.departureTime = 'Departure time is required.';
    }else if (new Date(flightDetails.departureTime) <= new Date()) {
      newErrors.flight.departureTime = 'Departure time must be in the future.';
 
    }
 
    if (!flightDetails.arrivalTime) {
      newErrors.flight.arrivalTime = 'Arrival time is required.';
    }else if (new Date(flightDetails.departureTime) >= new Date(flightDetails.arrivalTime)) {
      newErrors.flight.arrivalTime = 'Departure time must be earlier than arrival time.';
    }
 
    for (const seat of seatDetails) {
      if (seat.price <= 0) {
        newErrors.seats[seat.seatClass] = newErrors.seats[seat.seatClass] || {};
        newErrors.seats[seat.seatClass].price = 'Price must be greater than zero.';
      }
    }

    // Validate business class price is greater than economy class price
    const economySeat = seatDetails.find(seat => seat.seatClass === 'Economy');
    const businessSeat = seatDetails.find(seat => seat.seatClass === 'Business');
    if (economySeat && businessSeat) {
      if (economySeat.price >= businessSeat.price) {
        newErrors.seats['Business'] = newErrors.seats['Business'] || {};
        newErrors.seats['Business'].price = 'Business class price must be greater than economy class price.';
      }
    }
 
    stopDetails.forEach((stop, index) => {
      if (!stop.airportName) {
        newErrors.stops[index] = newErrors.stops[index] || {};
        newErrors.stops[index].airportName = 'Airport name is required.';
      }
      if (!stop.stopDuration) {
        newErrors.stops[index] = newErrors.stops[index] || {};
        newErrors.stops[index].stopDuration = 'Stop duration is required.';
      } else if (new Date(stop.stopDuration) <= new Date(flightDetails.departureTime) ||
                 new Date(stop.stopDuration) >= new Date(flightDetails.arrivalTime)) {
        newErrors.stops[index] = newErrors.stops[index] || {};
        newErrors.stops[index].stopDuration = 'Stop time must be between the departure and arrival times.';
      }
      if (stop.airportName === flightDetails.departureAirport || stop.airportName === flightDetails.arrivalAirport) {
        newErrors.stops[index] = newErrors.stops[index] || {};
        newErrors.stops[index].airportName = 'Stop airport cannot be the same as departure or arrival airport.';
      }
    });
 
    setErrors(newErrors);
    return Object.keys(newErrors.flight).length === 0 &&
           Object.keys(newErrors.seats).length === 0 &&
           Object.keys(newErrors.stops).length === 0;
  };
 
 
 
  const saveChanges = async (e) => {
    e.preventDefault();
    // if (!validateInputs()) {
    //  // alert('Please fix the errors before saving.');
    //   return;
    const isValid = validateInputs();
    if (!isValid) {
        return; 
       
    }
 
    const updatedFlightDetails = {
      flight: {
        id: flightId,
        airlineName: flightDetails.airline,
        departureAirportName: flightDetails.departureAirport,
        arrivalAirportName: flightDetails.arrivalAirport,
        departureTime: flightDetails.departureTime,
        arrivalTime: flightDetails.arrivalTime,
      },
      seats: Object.values(groupedSeats).map(seat => ({
        classType: seat.classType,
        price: seat.price
      })),
      stops: stopDetails.map(stop => ({
        stopId: stop.stopId,
        stopAirportName: stop.airportName,
        stopTime: stop.stopDuration,
      }))
    };
 
    try {
      await axios.put(`https://localhost:44339/api/Flight/UpdateFlightDetails`, updatedFlightDetails);
      alert('Flight details updated successfully');
      navigate(`/getFlights`);
    } catch (error) {
      console.error('Error updating flight details:', error);
    }
  };
 
  const cancelEdit = () => {
    navigate(`/getFlights`);
  };
 
  if (!flightDetails) {
    return <div className="loading">Loading...</div>;
  }
 
  return (
    <div className="edit-flight-page">
       {/* <h2 className="edit-flight-title">Edit Flight #{flightId}</h2>  */}
       <form onSubmit={saveChanges} >
      <div className="flight-details">
        <h3 className="section-title">Flight Details</h3>
        <h3 className="flight-number">Flight Number: {flightDetails.flightNumber}</h3>
        
        
       
        <label className="form-label" class="title">Departure Airport:</label>
        <select className="form-select" name="departureAirport" value={flightDetails.departureAirport} onChange={handleFlightChange} required>
          <option value="">Select an airport</option>
          {airports.map((airport) => (
            <option key={airport.id} value={airport.name}>{airport.name}</option>
          ))}
        </select>
        <div class="tire">{errors.flight.departureAirport && <span className="error-message">{errors.flight.departureAirport}</span>}</div>
       
        <label className="form-label" class="title">Arrival Airport:</label>
        <select className="form-select" name="arrivalAirport" value={flightDetails.arrivalAirport} onChange={handleFlightChange} required>
          <option value="">Select an airport</option>
          {airports.map((airport) => (
            <option key={airport.id} value={airport.name}>{airport.name}</option>
          ))}
        </select>
        <div class="tire">{errors.flight.arrivalAirport && <span className="error-message">{errors.flight.arrivalAirport}</span>}</div>
       
        <label className="form-label" class="title">Departure Time:</label>
        <input className="form-input" type="datetime-local" name="departureTime"
        value={flightDetails.departureTime} onChange={handleFlightChange} min={new Date().toISOString().slice(0, 16)} required />
        <div class="tire">{errors.flight.departureTime && <span className="error-message">{errors.flight.departureTime}</span>}</div>
       
        <label className="form-label" class="title">Arrival Time:</label>
        <input className="form-input" type="datetime-local" name="arrivalTime"
         value={flightDetails.arrivalTime} onChange={handleFlightChange} min={new Date().toISOString().slice(0, 16)} required />
        <div class="tire">{errors.flight.arrivalTime && <span className="error-message">{errors.flight.arrivalTime}</span>}</div>
      </div>
 
      <div className="seat-details">
  <h3 className="section-title">Seat Details</h3>
  {Object.values(groupedSeats).map((seat, index) => (
    <div className="seat-detail" key={index}>
      <label className="form-label">Class Type:</label>
      <input
        className="form-input"
        type="text"
        name="classType"
        value={seat.classType}
        readOnly
      />
 
      <label className="form-label">Price:</label>
      <input
        className="form-input"
        type="number"
        name="price"
        value={seat.price}
        onChange={(e) => handleGroupedSeatChange(seat.classType, e)}
        required
      />
      <div>{errors.seats[seat.classType]?.price && <span className="error-message">{errors.seats[seat.classType].price}</span>}</div>
    </div>
  ))}
</div>
      <div className="stop-details">
  <h3 className="section-title">Stop Details</h3>
  {stopDetails.map((stop, index) => (
    <div className="stop-detail" key={index}>
      <label className="form-label">Airport Name:</label>
      <select
        className="form-select"
        name="airportName"
        value={stop.airportName}
        onChange={(e) => handleStopChange(index, e)}
      >
        <option value="">Select an airport</option>
        {airports.map((airport) => (
          <option key={airport.id} value={airport.name}>{airport.name}</option>
        ))}
      </select>
      <div class="tire">{errors.stops[index]?.airportName && <span className="error-message">{errors.stops[index].airportName}</span>}</div>
 
      <label className="form-label">Stop Duration:</label>
      <input
        className="form-input"
        type="datetime-local"
        name="stopDuration"
        value={stop.stopDuration}
        min={new Date().toISOString().slice(0, 16)}
        onChange={(e) => handleStopChange(index, e) }
      />
      <div>{errors.stops[index]?.stopDuration && <span className="error-message">{errors.stops[index].stopDuration}</span>}</div>
    </div>
  ))}
</div>
 
 
      <button className="action-button" type="submit" >Save Changes</button>
      <button className="action-button cancel-button" onClick={cancelEdit}>Cancel</button>
      </form>
    </div>
  );
};
 
export default EditFlightPage;