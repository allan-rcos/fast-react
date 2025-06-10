import React from 'react';
import SimpleTopNavbar from './patials/SimpleTopNavbar/Navbar';
import {Outlet} from "react-router-dom";

function Index({children}) {
    return (
        <main className="space-y-5 bg-gray-100 min-h-screen">
            <SimpleTopNavbar/>
            <Outlet/>
        </main>
    );
}

export default Index;