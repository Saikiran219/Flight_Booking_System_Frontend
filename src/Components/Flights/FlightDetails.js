// FlightDetails.js
import React from 'react';
import './FlightDetails.css'; // Import the CSS file for styling
 
const FlightDetails = ({ flight,selectedClass}) => {
  console.log(flight.seats);
    // Function to format stops
    const formatStops = (stops) => {
        if (stops.length === 0) {
            return <p className="no-stops-message">There are no stops between departure and arrival.</p>;
        }
 
        return stops.map((stop, index) => (
            <div key={index}>
                <p className="flight-stop"><strong>Stop {index + 1}:</strong> {stop.airportName} - {new Date(stop.stopDuration).toLocaleTimeString()}</p>
            </div>
        ));
    };
 
    return (
        <div className="flight-detail mt-4 p-3">
            <h4 className="flight-header">Flight Details</h4>
            <p className="flight-info"><strong>Flight Number:</strong> {flight.flightNumber}</p>
            <p className="flight-info"><strong>Airline:</strong> {flight.airline}</p>
            <p className="flight-info"><strong>Departure:</strong> {flight.departureAirport} - {new Date(flight.departureTime).toLocaleString()}</p>
            <p className="flight-info"><strong>Arrival:</strong> {flight.arrivalAirport} - {new Date(flight.arrivalTime).toLocaleString()}</p>
            <p className="flight-info"><strong>Stops:</strong></p>
            {formatStops(flight.stops)}
            <p>{flight.className}</p>
            <p className="flight-info"><strong>Baggage Allowance:</strong> {flight.baggageAllowance} X 2 kg</p>
            <p className="flight-info"><strong>Cabbin baggage:</strong> {selectedClass === 'Economy' ? '1 X 7 kg' :
                selectedClass === 'Business' ? '2 X 7 kg' :
                'N/A'} {/* Default or fallback if class type is not recognized */}</p>
            <p className="flight-info"><strong>Meal :</strong> Free Meal</p>
        </div>
    );
};
 
export default FlightDetails;