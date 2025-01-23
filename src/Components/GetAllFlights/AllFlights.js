import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AllFlights.css';
 
const GetAllFlights = () => {
    const [flights, setFlights] = useState([]);
    const [filteredFlights, setFilteredFlights] = useState([]);
    const [departureAirports, setDepartureAirports] = useState([]);
    const [arrivalAirports, setArrivalAirports] = useState([]);
    const [airlines, setAirlines] = useState([]);
    const [selectedDeparture, setSelectedDeparture] = useState("");
    const [selectedArrival, setSelectedArrival] = useState("");
    const [selectedAirline, setSelectedAirline] = useState("");
   
    const [showDropdowns, setShowDropdowns] = useState(false); // State to manage dropdown visibility
 
    const navigate = useNavigate();
 
    useEffect(() => {
        axios.get('https://localhost:44339/api/Flight/GetAllFlights')
            .then(response => {
                setFlights(response.data);
                setFilteredFlights(response.data);
            })
            .catch(error => {
                console.error("There was an error fetching the flights!", error);
            });
 
        fetchDropdownData();
    }, []);
 
    const fetchDropdownData = async () => {
        try {
            const [departureResponse, arrivalResponse, airlineResponse] = await Promise.all([
                axios.get('https://localhost:44339/api/Airports'),
                axios.get('https://localhost:44339/api/Airports'),
                axios.get('https://localhost:44339/api/Airlines')
            ]);
            setDepartureAirports(departureResponse.data);
            setArrivalAirports(arrivalResponse.data);
            setAirlines(airlineResponse.data);
        } catch (error) {
            console.error("Error fetching dropdown data:", error);
        }
    };
 
    const handleSelectChange = (e, column) => {
        const value = e.target.value;
 
        if (column === 'departure') {
            setSelectedDeparture(value);
        } else if (column === 'arrival') {
            setSelectedArrival(value);
        } else if (column === 'airline') {
            setSelectedAirline(value);
        }
    };
 
    useEffect(() => {
        applyFilter();
    }, [selectedDeparture, selectedArrival, selectedAirline]);
 
    const applyFilter = () => {
        let filtered = flights;
 
        if (selectedDeparture) {
            filtered = filtered.filter(flight => flight.departureAirportName === selectedDeparture);
        }
 
        if (selectedArrival) {
            filtered = filtered.filter(flight => flight.arrivalAirportName === selectedArrival);
        }
 
        if (selectedAirline) {
            filtered = filtered.filter(flight => flight.airlineName === selectedAirline);
        }
 
        setFilteredFlights(filtered);
    };
 
    const handleEdit = (flightId, seatId, stopId) => {
        navigate(`/edit-flight/${flightId}/${seatId}/${stopId}`);
    };
 
    const handleDelete = async (flightId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this flight?");
        if (!confirmDelete) return;
 
        try {
            await axios.delete(`https://localhost:44339/api/Flight/delete-flight/${flightId}`);
            setFlights(flights.filter(flight => flight.flightId !== flightId));
            setFilteredFlights(filteredFlights.filter(flight => flight.flightId !== flightId));
            alert("Successfully deleted the Flight");
        } catch (error) {
            console.error("There was an error deleting the flight!", error);
        }
    };
 
    const toggleDropdowns = () => {
        setShowDropdowns(prevState => !prevState);
    };

     // Reset filters
     const resetFilters = () => {
        setSelectedDeparture("");
        setSelectedArrival("");
        setSelectedAirline("");
        setFilteredFlights(flights); // Reset the flight list to show all flights
    };
 
    return (
        <div className="flight-list-container">
            <h1 className="flight-list-title">Flight List</h1>
            <div className="filter-container">
                SearchFlights
                <button onClick={toggleDropdowns} className="filter-icon">🔍</button>
                {showDropdowns && (
                    <div className="dropdowns">
                        <select
                            className="form-select"
                            name="departureAirportName"
                            onChange={(e) => handleSelectChange(e, 'departure')}
                            value={selectedDeparture}
                        >
                            <option value="">Select  Departure Airport</option>
                            {departureAirports.map((airport, index) => (
                                <option key={index} value={airport.name}>{airport.name}</option>
                            ))}
                        </select>
                        <select
                            className="form-select"
                            name="arrivalAirportName"
                            onChange={(e) => handleSelectChange(e, 'arrival')}
                            value={selectedArrival}
                        >
                            <option value="">Select  Arrival Airport</option>
                            {arrivalAirports.map((airport, index) => (
                                <option key={index} value={airport.name}>{airport.name}</option>
                            ))}
                        </select>
                        <select
                            className="form-select"
                            name="airline"
                            onChange={(e) => handleSelectChange(e, 'airline')}
                            value={selectedAirline}
                        >
                            <option value="">Select Airline</option>
                            {airlines.map((airline, index) => (
                                <option key={index} value={airline.airlineName}>{airline.airlineName}</option>
                            ))}
                        </select>
                        <button className="reset-filter-btn" onClick={resetFilters}>Reset Filters</button>
                    </div>
                )}
            </div>

          

            <table className="flight-list-table">
                <thead>
                    <tr>
                        <th>Flight ID</th>
                        <th>Departure Airport</th>
                        <th>Arrival Airport</th>
                        <th>Airline</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredFlights.length === 0 ? (
                        <tr>
                            <td colSpan="5">No flights found for the selected criteria.</td>
                        </tr>
                    ) : (
                        filteredFlights.map((flight) => (
                            <tr key={flight.flightId}>
                                <td>{flight.flightId}</td>
                                <td>{flight.departureAirportName}</td>
                                <td>{flight.arrivalAirportName}</td>
                                <td>{flight.airlineName}</td>
                                <td>
                                    <button className="flight-action-button edit" onClick={() => handleEdit(flight.flightId, flight.seats[0]?.seatId, flight.stops[0]?.stopId)}>Edit</button>
                                    <button className="flight-action-button delete" onClick={() => handleDelete(flight.flightId)}>Delete</button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};
 
export default GetAllFlights;
 