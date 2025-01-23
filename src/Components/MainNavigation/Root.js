import {Outlet} from 'react-router-dom';
import Navbar from '../NavBar/Navbar';
import Footer from '../Footer/Footer';
export default function RootLayout(){
    return(<>
    <Navbar />
    <main>
        <Outlet />
    </main>
<Footer/>
    </>
    );
 }