import { createStore } from 'redux';

// Reducer to manage booking data
const initialState = {
    bookingData: [],
    booking: {
        flight: null,
        totalPrice: 0,
        bookingId: null,
        passengerIds: []
    }
};

function bookingReducer(state = initialState, action) {
    console.log('action: ',action.payLoad);
    
    switch (action.type) {
        case 'SET_BOOKING_DATA':
            return {
                ...state,
                bookingData: [...state.bookingData, action.payLoad]
            };
        default:
            return state;
    }
}

const store = createStore(bookingReducer);


export default store;
