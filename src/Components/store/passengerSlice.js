import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    numberOfPassengers: parseInt(sessionStorage.getItem('numberOfPassengers')) || 1, // Fetch from sessionStorage or set default to 1
};

const passengerSlice = createSlice({
    name: 'Passengers',
    initialState,
    reducers: {
        setNumberOfPassengers: (state, action) => {
            state.numberOfPassengers = action.payload;
            sessionStorage.setItem('numberOfPassengers', action.payload); // Save to sessionStorage
        },
        resetPassengers: (state) => {
            state.numberOfPassengers = 1; // Reset to 1
            sessionStorage.removeItem('numberOfPassengers'); // Clear sessionStorage
        },
    },
});

export const { setNumberOfPassengers, resetPassengers } = passengerSlice.actions;

export default passengerSlice.reducer;
