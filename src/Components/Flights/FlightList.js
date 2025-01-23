import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import axiosInstance from '../Authnticate/axiosInstance';
import FlightDetails from './FlightDetails';

export default function FlightList() {
    const location = useLocation();
    const basicSearchResults = location.state?.flights || [];
    const passengers = location.state?.passengers || [];
    const classType = location.state?.classType || '';

    const [flights, setFlights] = useState(basicSearchResults);
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [airline, setAirline] = useState('');
    const [selectedFlight, setSelectedFlight] = useState(null);
    const [numberOfStops, setNumberOfStops] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [showDetailsModal, setShowDetailsModal] = useState(false); // State for modal visibility
    const navigate = useNavigate();

    const handleFilter = () => {
        let filteredFlights = [...basicSearchResults];

        if (minPrice) {
            filteredFlights = filteredFlights.filter(flight => flight.price >= parseFloat(minPrice));
        }

        if (maxPrice) {
            filteredFlights = filteredFlights.filter(flight => flight.price <= parseFloat(maxPrice));
        }

        if (airline) {
            filteredFlights = filteredFlights.filter(flight => flight.airline.toLowerCase().includes(airline.toLowerCase()));
        }

        if (numberOfStops) {
            filteredFlights = filteredFlights.filter(flight => flight.numberOfStops === parseInt(numberOfStops, 10));
        }

        if (filteredFlights.length === 0) {
            setErrorMessage('No flights found with the applied filters.');
        } else {
            setErrorMessage('');
        }

        setFlights(filteredFlights);
    };

       // Reset filters to their initial state
       const resetFilter = () => {
        setMinPrice('');
        setMaxPrice('');
        setAirline('');
        setNumberOfStops('');
        setFlights(basicSearchResults); // Reset to initial flight list
        setErrorMessage(''); // Clear any error message
    };

    const viewFlightDetails = async (flightId) => {
        if (!flightId) {
            setErrorMessage('Invalid flight ID');
            return;
        }

        try {
            const response = await axiosInstance.get(`/Flight/${flightId}`);
            setSelectedFlight(response.data);
            setShowDetailsModal(true); // Show modal on successful fetch
        } catch (error) {
            if (error.response && error.response.status === 400) {
                setErrorMessage('No flight details found.');
            } else {
                setErrorMessage('Error in fetching flight details.');
            }
            console.error(error);
        }
    };

    const handleBooking = (flight) => {
        navigate('/booking', { state: { flight, passengers, classType } });
    };

    const closeModal = () => {
        setShowDetailsModal(false);
        setSelectedFlight(null); // Clear selected flight on close
    };

    return (
        <div className="container mt-5">
            <h2>Advance Filters</h2>
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

            {/* Optional Filters */}
            <div className="form-row mb-3">
                <div className="form-group col-md-3">
                    <label>Min Price</label>
                    <input
                        type="number"
                        className="form-control"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        placeholder="Min Price"
                    />
                </div>
                <div className="form-group col-md-3">
                    <label>Max Price</label>
                    <input
                        type="number"
                        className="form-control"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        placeholder="Max Price"
                    />
                </div>
                <div className="form-group col-md-3">
                    <label>Airline</label>
                    <input
                        type="text"
                        className="form-control"
                        value={airline}
                        onChange={(e) => setAirline(e.target.value)}
                        placeholder="Airline Name"
                    />
                </div>
                <div className="form-group col-md-3">
                    <label>Number of Stops</label>
                    <input
                        type="number"
                        className="form-control"
                        value={numberOfStops}
                        onChange={(e) => setNumberOfStops(e.target.value)}
                        placeholder="Stops"
                    />
                </div>
            </div>

            <button className="btn btn-primary" onClick={handleFilter}>
                Apply Filters
            </button>

            <button className="btn btn-primary ml-4" onClick={resetFilter}>
                Reset Filters
            </button>

        {/* Display the filtered flight results */}
<div className="mt-4">
    {flights.length > 0 ? (
        <table className="table p-5 m-2">
            <thead>
                <tr>
                    <th className="text-center">Flight Number</th>
                    <th className="text-center">Departure Airport</th>
                    <th className="text-center">Arrival Airport</th>
                    <th className="text-center">Airline</th>
                    <th className="text-center">Price ({classType})</th>
                    <th className="text-center">Actions</th> {/* Centered Action Header */}
                </tr>
            </thead>
            <tbody>
                {flights.map((flight, index) => (
                    <tr key={index}>
                        <td className="text-center">{flight.flightNumber}</td>
                        <td className="text-center">{flight.departureAirport}</td>
                        <td className="text-center">{flight.arrivalAirport}</td>
                        <td className="text-center">{flight.airline}</td>
                        <td className="text-center">${flight.price }</td>
                        <td className="text-center">
                            <button className="btn btn-info mr-1 ml-4" onClick={() => viewFlightDetails(flight.flightNumber)}>
                                Flight Details
                            </button>
                            <button className="btn btn-info p-2" onClick={() => handleBooking(flight)}>
                                Book
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    ) : (
        <div>No flights available.</div>
    )}
</div>
 

            {/* Flight Details Modal */}
            {selectedFlight && showDetailsModal && (
                <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" role="dialog" onClick={closeModal}>
                    <div className="modal-dialog" role="document" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Flight Details</h5>
                                <button type="button" className="close" onClick={closeModal} aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                {/* Render FlightDetails component here */}
                                <FlightDetails flight={selectedFlight} selectedClass={classType} />
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={closeModal}>Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
