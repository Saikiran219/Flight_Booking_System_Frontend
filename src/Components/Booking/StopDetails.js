import React from 'react';
import './Ticket.css';

const StopDetails = ({ stops }) => {
    return (
        <div className="mt-4 ticket">
            <h5>Stop Details:</h5>
            {stops && stops.length > 0 ? (
                stops.map((stop, index) => (
                    <div key={index} className="stop-detailSS">
                        <p className="custom-ticket-css"><strong>Stop {index + 1}:</strong> {stop.airportName} </p>
                        <p className="custom-ticket-css"><strong>Stop Duration:</strong> {new Date(stop.stopDuration).toLocaleString()}</p>
                    </div>
                ))
            ) : (
                <p>No Intermediate Airports Found.</p>
            )}
        </div>
    );
};

export default StopDetails;
