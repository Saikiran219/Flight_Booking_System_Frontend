import React from 'react';
import './App.css';
import {createBrowserRouter,RouterProvider} from 'react-router-dom'
import RootLayout from './Components/MainNavigation/Root';
import HomePage from './Components/Home/Home';

import About from './Components/Aboutandcontactpage/About';
import Contact from './Components/Aboutandcontactpage/Contact';
import BookingPage from './Components/Booking/BookingPage';
import Login from './Components/Login/Login';
import Register from './Components/Register/Register';
import PrivateRoute from './Components/MainNavigation/PrivateRoute';
import ProfilePage from './Components/Profile/ProfilePage';
import FlightList from './Components/Flights/FlightList';
import TicketPage from './Components/Booking/Ticket';
import store from './Components/Booking/store';
import { Provider } from 'react-redux';
import EmailSender from './Components/PasswordRecovery/EmailSender';
import ResetPassword from './Components/PasswordRecovery/ResetPassword';
import AddFlight from './Components/AddFlight/Addflight';
import AllFlights from './Components/GetAllFlights/AllFlights';
import EditFlight from './Components/UpdateFlight/EditFlight';


    
const router = createBrowserRouter([
    { path: '/', element: <RootLayout />, children: [   
        { index: true, element: <HomePage />, },
        { path: '/flightlist', element: <FlightList /> },
        {
            element: <PrivateRoute allowedRoles={['User', 'Admin']}/>,  // General private route for authenticated users
            children: [
                { path: '/booking', element: <BookingPage /> },
                { path: '/ticket', element: <TicketPage /> },
                { path: '/profile', element: <ProfilePage /> },
            ]
        },
        {
            element: <PrivateRoute allowedRoles={['Admin']}/>,  // Admin-specific private route
            children: [
                { path: '/addFlights', element: <AddFlight /> },
                { path: '/getFlights', element: <AllFlights /> },
                { path: '/edit-flight/:flightId/:seatId/:stopId', element: <EditFlight /> },
            ]
        },
        { path: '/about', element: <About /> },
        { path: '/contact', element: <Contact /> },
        { path: '/login', element: <Login /> },
        { path: '/register', element: <Register /> },
        { path: '/EmailSender', element: <EmailSender /> },
        { path: '/passwordReset', element: <ResetPassword /> },  // Updated
    ]}
]);

function App() {


    return (
        <>
       <Provider store={store}>
       <div className="background-container"></div>
            <div className="content">
                <RouterProvider router={router} />
            </div>

       </Provider>
         
        </>
      
    );
}

export default App;
