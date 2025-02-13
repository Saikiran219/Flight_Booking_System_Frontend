import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SearchForm.css';

const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return isNaN(date) ? '' : date.toISOString().split('T')[0]; // Format to YYYY-MM-DD
};

export default function SearchForm({ onSearch }) {
    const [departureAirports, setDepartureAirports] = useState([]);
    const [arrivalAirports, setArrivalAirports] = useState([]);
    const [selectedDeparture, setSelectedDeparture] = useState('');
    const [selectedArrival, setSelectedArrival] = useState('');
    const [departureDate, setDepartureDate] = useState('');
    const [classType, setClassType] = useState('');
    const [passengers, setPassengers] = useState(1);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchAirports = async () => {
            try {
                const response = await axios.get('https://localhost:7144/api/Airports');
                setDepartureAirports(response.data);
                setArrivalAirports(response.data);
            } catch (error) {
                setErrorMessage('Error fetching airports data');
                console.error(error);
            }
        };

        fetchAirports();
    }, []);

    const handleSearch = async () => {
        if (!selectedDeparture || !selectedArrival || !departureDate || !classType) {
            setErrorMessage('Please fill in all required fields.');
            return;
        }
        const formattedDate = formatDate(departureDate);
        const searchParams = new URLSearchParams({
            DepartureAirportName: selectedDeparture,
            ArrivalAirportName: selectedArrival,
            DepartureDate: formattedDate,
            ClassType: classType,
            NumberOfPassengers: passengers.toString(),
        });

        try {
            const response = await axios.get('https://localhost:7144/api/Flight/Basicsearch', { params: searchParams });
            const data = response.data;

            if (data.length === 0) {
                setErrorMessage('No flights found.');
            } else {
                setErrorMessage(''); // Clear any previous error message
                onSearch(data, passengers, classType); // Pass data to parent component
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                setErrorMessage('No flights found based on the search criteria.');
            } else {
                setErrorMessage('Error fetching flights.');
            }
            console.error(error);
        }
    };

    const handlePassengersChange = (e) => {
        const value = parseInt(e.target.value, 10);
        if (isNaN(value) || value < 1) {
            setPassengers(1);  // Default to 1 if invalid
         } else {
            // Validate based on class type
            if (classType === 'Economy' && (value < 1 || value > 9)) {
                setErrorMessage('Economy class allows 1 to 9 passengers.');
            } else if (classType === 'Business' && (value < 1 || value > 9)) {
                setErrorMessage('Business class allows 1 to 9 passengers.');
            } else {
                setErrorMessage('');  // Clear the error message if valid
                setPassengers(value);
            }
        
        }
    };

    // Real-time handlers to clear errors when valid input is provided
    const handleDepartureChange = (e) => {
        setSelectedDeparture(e.target.value);
        if (selectedArrival && e.target.value === selectedArrival) {
            setErrorMessage('Departure and arrival airports must be different.');
        } else {
            setErrorMessage(''); // Clear error message
        }
    };

    const handleArrivalChange = (e) => {
        setSelectedArrival(e.target.value);
        if (selectedDeparture && e.target.value === selectedDeparture) {
            setErrorMessage('Departure and arrival airports must be different.');
        } else {
            setErrorMessage(''); // Clear error message
        }
    };

    const handleDateChange = (e) => {
        setDepartureDate(e.target.value);
        setErrorMessage(''); // Clear error message when date is changed
    };

    const handleClassTypeChange = (e) => {
        const selectedClass = e.target.value;
        setClassType(selectedClass);
    
        // Validate based on the new class type
        if (selectedClass === 'Economy' && (passengers < 1 || passengers > 9)) {
            setErrorMessage('Economy class allows between 1 to 9 passengers.');
        } else if (selectedClass === 'Business' && (passengers < 1 || passengers > 9)) {
            setErrorMessage('Business class allows between 1 to 9 passengers.');
        } else {
            setErrorMessage(''); // Clear the error message if valid
        }
    };
    

    return (
        <>
            <div className="form-row mb-3">
                <div className="form-group col-md-6">
                    <label>Departure Airport</label>
                    <select className="form-control" onChange={handleDepartureChange} value={selectedDeparture} required>
                        <option value="">Select Departure Airport</option>
                        {departureAirports.map((airport, index) => (
                            <option key={index} value={airport.name}>{airport.name}</option>
                        ))}
                    </select>
                </div>
                <div className="form-group col-md-6">
                    <label>Arrival Airport</label>
                    <select className="form-control" onChange={handleArrivalChange} value={selectedArrival} required>
                        <option value="">Select Arrival Airport</option>
                        {arrivalAirports.map((airport, index) => (
                            <option key={index} value={airport.name}>{airport.name}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="form-row mb-3">
                <div className="form-group col-md-6">
                    <label>Departure Date</label>
                    <input type="date" className="form-control" onChange={handleDateChange} value={departureDate} min={new Date(Date.now() + 86400000).toISOString().split("T")[0]} required />
                </div>
                <div className="form-group col-md-6">
                    <label>Class Type</label>
                    <select className="form-control" onChange={handleClassTypeChange} value={classType} required>
                        <option value="">Select Class</option>
                        <option value="Economy">Economy</option>
                        <option value="Business">Business</option>
                    </select>
                </div>
            </div>
            <div className="form-row mb-3">
                <div className="form-group col-md-6">
                    <label>Passengers</label>
                    <input
                        type="number"
                        className="form-control"
                        onChange={handlePassengersChange}
                        value={passengers}
                        min="1"
                        required
                    />
                </div>
            </div>
            <button className="btn btn-primary" onClick={handleSearch}>Search Flights</button>
            {errorMessage && <div className="alert alert-danger mt-3">{errorMessage}</div>}
        </>
    );
}
