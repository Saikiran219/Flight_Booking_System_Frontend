// Ticket.js
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import StopDetails from './StopDetails';
import './Ticket.css';
import axiosInstance from '../Authnticate/axiosInstance';
import axios from 'axios';
 
export default function TicketPage() {
    const location = useLocation();
    const { flight: initialFlight, passengers, totalPrice, bookingId, passengerIds, seatBookings, statusId } = location.state || {};
    const [flight, setFlight] = useState(initialFlight);
    const [currentPassengers, setCurrentPassengers] = useState(passengers || []);
    const [loading, setLoading] = useState(false);
 
    useEffect(() => {
        const fetchFlightDetails = async () => {
            try {
                const response = await axiosInstance.get(`/Flight/${initialFlight.flightNumber}`);
                setFlight(response.data);
            } catch (error) {
                console.error("Error fetching flight details:", error);
            }
        };
 
        if (initialFlight && initialFlight.flightNumber) {
            fetchFlightDetails();
        }
    }, [initialFlight]);
 
    if (!flight || !passengers) {
        return <p>Loading flight and passenger details...</p>;
    }
 
    const isCancelDisabled = statusId === 0 || statusId === 1;
 
    const handleCancelTicket = async () => {
        const confirmCancel = window.confirm("Are you sure you want to cancel the ticket?");
        if (!confirmCancel) return;
        setLoading(true);
        try {
            await axios.delete(`https://localhost:44339/api/Booking/cancel/${bookingId}`);
            setCurrentPassengers([]);
            alert("Ticket canceled successfully.");
        } catch (error) {
            console.error('An error occurred while deleting the booking and passengers.'); // Log error
        } finally {
            setLoading(false);
        }
    };
 
    const getSeatForPassenger = (index) => {
        return seatBookings && seatBookings[index] ? seatBookings[index] : {};
    };
 
    return (
        <div className="container mt-5 my-ticket">
            <div className="card">
                <div className="card-body ticket">
                    <h4 className="custom-ticket-css h4">Booking ID: {bookingId}</h4>
 
                    <h5 className="custom-ticket-css h5">Flight Details:</h5>
                    <table className="table custom-table">
                        <tbody>
                            <tr>
                                <td><strong>Flight Number:</strong></td>
                                <td>{flight.flightNumber}</td>
                            </tr>
                            <tr>
                                <td><strong>Airline:</strong></td>
                                <td>{flight.airline || 'N/A'}</td>
                            </tr>
                            <tr>
                                <td><strong>Departure:</strong></td>
                                <td>{flight.departureAirport || 'N/A'}</td>
                            </tr>
                            <tr>
                                <td><strong>Arrival:</strong></td>
                                <td>{flight.arrivalAirport || 'N/A'}</td>
                            </tr>
                            <tr>
                                <td><strong>Departure Time:</strong></td>
                                <td>{new Date(flight.departureTime).toLocaleString() || 'N/A'}</td>
                            </tr>
                            <tr>
                                <td><strong>Arrival Time:</strong></td>
                                <td>{new Date(flight.arrivalTime).toLocaleString() || 'N/A'}</td>
                            </tr>
                        </tbody>
                    </table>
 
                    <h4 className="custom-ticket-css">Total Price: ${totalPrice}</h4>
 
                   
                    <StopDetails stops={flight.stops} />
 
                    <h5 className="mt-4 custom-ticket-css h5">Passenger Details:</h5>
                    <table className="table custom-table">
                        <thead>
                            <tr>
                                <th>Passenger ID</th>
                                <th>Name</th>
                                <th>Age</th>
                                <th>Gender</th>
                                <th>Phone Number</th>
                                <th>Seat Number</th>
                                <th>Seat Position</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentPassengers.map((passenger, i) => {
                                const seat = getSeatForPassenger(i);
                                return (
                                    <tr key={i}>
                                        <td>{passengerIds[i] || 'N/A'}</td>
                                        <td>{passenger.firstName} {passenger.lastName}</td>
                                        <td>{passenger.age || 'N/A'}</td>
                                        <td>{passenger.gender || 'N/A'}</td>
                                        <td>{passenger.phoneNumber || 'N/A'}</td>
                                        <td>{seat.seatNumber || 'N/A'}</td>
                                        <td>{seat.seatPosition || 'N/A'}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
 
                    {currentPassengers.length > 0 && (
                        <button onClick={handleCancelTicket} className="btn btn-danger mt-4" disabled={loading || isCancelDisabled}>
                            {loading ? 'Cancelling Ticket...' : 'Cancel Ticket'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
 