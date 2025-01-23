import { configureStore } from "@reduxjs/toolkit";
import airportSlice from './airportSlice'
import passengerSlice from './passengerSlice';

const store=configureStore({
    reducer:{
        Airports:airportSlice,
        Passengers: passengerSlice,
    }
});
 export default store;

// import { configureStore } from "@reduxjs/toolkit";
// import airportSlice from './airportSlice';
// import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
// import { persistReducer, persistStore } from 'redux-persist';
// import { combineReducers } from 'redux';
// import passengerSlice from './passengerSlice';

// // Set up the persist configuration for the Airports reducer
// const persistConfig = {
//     key: 'root',
//     storage,
// };

// // Combine reducers if you have more than one slice
// const rootReducer = combineReducers({
//     Airports: airportSlice,
//     Passengers: passengerSlice,

// });

// // Persist the root reducer
// const persistedReducer = persistReducer(persistConfig, rootReducer);

// // Create the store using the persisted reducer
// const store = configureStore({
//     reducer: persistedReducer,
// });

// // Set up the persistor
// export const persistor = persistStore(store);

// export default store;
