import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ProfilePage.css';
 
export default function ProfilePage() {
    const [user, setUser] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [bookingHistory, setBookingHistory] = useState([]);
    const [isHistoryVisible, setIsHistoryVisible] = useState(false); // State for toggling history visibility
 
    const navigate = useNavigate();
 
    useEffect(() => {
        const fetchUserDetails = async () => {
            const token = localStorage.getItem('authToken');
            const email = localStorage.getItem('userEmail');
 
            if (!token) {
                setErrorMessage('You need to log in to view this page.');
                navigate('/login');
                return;
            }
 
            if (!email) {
                setErrorMessage('No user email found.');
                return;
            }
 
            try {
                const response = await axios.get("https://localhost:44339/api/UserLogin/UserByEmail", {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                    params: { email },
                });
 
                if (response.status === 200) {
                    setUser(response.data);
                } else {
                    setErrorMessage('Failed to fetch user details.');
                }
            } catch (err) {
                setErrorMessage('Error fetching user details. Please try again.');
                console.error('Error fetching user details:', err);
            }
        };
 
        fetchUserDetails();
    }, [navigate]);
 
    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userId'); // Clear user ID on logout
        navigate('/');
    };
 
    const handleFetchBookingHistory = async () => {
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('authToken');
 
        if (!userId) {
            setErrorMessage('User ID not found. Please log in again.');
            return;
        }
 
        try {
            const response = await axios.get(`https://localhost:44339/api/Booking/user/${userId}/bookings`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
 
            if (response.status === 200) {
                const updatedBookings = response.data.map(booking => {
                    const currentDate = new Date();
                    const departureDate = new Date(booking.flight.departureTime); // Adjust according to your API response structure
 
                    // Check the status and update accordingly
                    if (booking.statusId === -1) {
                        return {
                            ...booking,
                            statusId: departureDate < currentDate ? 1 : -1 // Update to 1 if departure has passed
                        };
                    }
                    return booking;
                });
                setBookingHistory(updatedBookings);
            } else {
                setErrorMessage('Failed to fetch booking history.');
            }
        } catch (err) {
            setErrorMessage('The user does not contain any booking history.');
            console.error('Error fetching booking history:', err);
        }
    };
 
    const toggleBookingHistory = () => {
        if (!isHistoryVisible) {
            handleFetchBookingHistory(); // Fetch history only when opening
        }
        setIsHistoryVisible(!isHistoryVisible); // Toggle visibility
    };
 
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? 'Invalid date' : date.toLocaleDateString();
    };
 
    const getStatusLabel = (status) => {
        switch (status) {
            case 1:
                return <span className="text-success">Completed</span>;
            case 0:
                return <span className="text-danger">Cancelled</span>;
            case -1:
                return <span className="text-primary">Pending</span>;
            default:
                return <span className="text-secondary">Unknown</span>;
        }
    };
 
    const handleTicketNavigation = (booking) => {
        const statusId = booking.statusId;
        const passengers = booking.passengers.map((passenger, index) => ({
            passengerId: passenger.passengerId || 'N/A',
            firstName: passenger.firstName || 'N/A',
            lastName: passenger.lastName || 'N/A',
            age: passenger.age || 'N/A',
            gender: passenger.gender || 'N/A',
            phoneNumber: passenger.phoneNumber || 'N/A',
            seatNumber: booking.seats[index]?.seatNumber || 'N/A',
            seatPosition: booking.seats[index]?.seatPosition || 'N/A',
        }));
 
        const passengerIds = booking.passengers.map(passenger => passenger.passengerId || 'N/A');
        const seatBookings = booking.seats.map(seat => ({
            seatNumber: seat.seatNumber || 'N/A',
            seatPosition: seat.seatPosition || 'N/A',
        }));
 
        const seatPrice = booking.seats[0]?.price || 0;
        const totalPrice = seatPrice * booking.passengers.length;
 
        navigate('/ticket', {
            state: {
                flight: {
                    flightNumber: booking.flight?.flightNumber || 'N/A',
                    airline: booking.flight?.airline || 'N/A',
                    departureAirport: booking.flight?.departureAirport || 'N/A',
                    arrivalAirport: booking.flight?.arrivalAirport || 'N/A',
                    departureTime: booking.flight?.departureTime || 'N/A',
                    arrivalTime: booking.flight?.arrivalTime || 'N/A',
                    stops: booking.flight?.stops || [],
                },
                totalPrice,
                bookingId: booking.bookingId || '',
                passengers,
                passengerIds,
                seatBookings,
                statusId,
            },
        });
    };
 
    const handleDownloadTicket = async (bookingId) => {
        const token = localStorage.getItem('authToken');
        try {
            const response = await axios.get(`https://localhost:44339/api/Booking/DownloadTicket/${bookingId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                responseType: 'blob',
            });
 
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `BookingTicket_${bookingId}.pdf`);
            document.body.appendChild(link);
            link.click();
        } catch (err) {
            setErrorMessage('Failed to download ticket. Please try again.');
            console.error('Error downloading ticket:', err);
        }
    };
 
    return (
        <div className="profile-container">
            <div className="profile-content">
                <h3>Profile Details</h3>
                {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                {user ? (
                    <div className="profile-info">
                        <table className="table table-striped">
                            <tbody>
                                <tr><td>Name:</td><td>{user.name}</td></tr>
                                <tr><td>Email:</td><td>{user.email}</td></tr>
                                <tr><td>Phone Number:</td><td>{user.phoneNumber}</td></tr>
                                <tr><td>Gender:</td><td>{user.gender}</td></tr>
                                <tr><td>Address:</td><td>{user.address}</td></tr>
                            </tbody>
                        </table>
                        <div className="d-flex justify-content-between mt-3">
                            <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
                            <button className="btn btn-info" onClick={toggleBookingHistory}>
                                {isHistoryVisible ? 'Close Booking History' : 'View Booking History'}
                            </button>
                        </div>
 
                        {isHistoryVisible && bookingHistory.length > 0 && (
                            <div className="historyy mt-5">
                                <h3>Your Booking History</h3>
                                <table className="table table-striped">
                                    <thead>
                                        <tr>
                                            <th className="text-center">Booking ID</th>
                                            <th className="text-center">Booking Date</th>
                                            <th className="text-center">Ticket Details</th>
                                            <th className="text-center">Status</th>
                                            <th className="text-center">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {bookingHistory.map((booking) => (
                                            <tr key={booking.bookingId}>
                                                <td className="text-center">{booking.bookingId}</td>
                                                <td className="text-center">{formatDate(booking.bookingDate)}</td>
                                                <td className="text-center">
                                                    <button className="btn btn-info" onClick={() => handleTicketNavigation(booking)}>
                                                        View Ticket
                                                    </button>
                                                </td>
                                                <td className="text-center">{getStatusLabel(booking.statusId)}</td>
                                                <td className="text-center">
                                                    {booking.statusId === -1 && (
                                                        <button className="btn btn-success" onClick={() => handleDownloadTicket(booking.bookingId)}>
                                                            Download Ticket
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="login-prompt">
                        <p>Please log in to see your profile details.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
 