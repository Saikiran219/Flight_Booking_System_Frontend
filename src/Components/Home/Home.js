// HomePage.js
import React from 'react';  // Ensure useState is imported
import SearchForm from './SearchForm';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
    const navigate = useNavigate();
   

    const handleSearch = (flights, passengers,classType) => {
        navigate('/FlightList', { state: { flights, passengers,classType } }); // Pass passengers along with flights
    };

    return (
        <div>
            <div className="container mt-5 search">
                <h2>Search The Flights</h2>
                <SearchForm onSearch={handleSearch} />  {/* Pass passengers to SearchForm */}
            </div>
        </div>
    );
}
