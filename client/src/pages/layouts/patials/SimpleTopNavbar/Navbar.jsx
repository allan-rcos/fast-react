import React, {useState} from 'react';
import NavItem from "./NavItem";
import {useLocation} from "react-router-dom";
import PATHS from "../../../../config/PATHS";

function Navbar() {
    const loc = useLocation();
    const [hidden, setHidden] = useState('hidden');
    const toggleBurger = () => setHidden(hidden?.length ? '' : 'hidden')
    return (
        <header className="bg-slate-600">
            <div className="py-4 px-2 lg:mx-4 xl:mx-12 ">
                <div className="">
                    <nav
                        className="flex items-center justify-between flex-wrap  ">
                        <div className="block lg:hidden">
                            <button onClick={() => toggleBurger()}
                                    className="navbar-burger flex items-center px-3 py-2 border rounded text-white border-white hover:text-white hover:border-white">
                                <svg
                                    className="fill-current h-6 w-6 text-gray-700"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <title>Menu</title>
                                    <path
                                        d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"/>
                                </svg>
                            </button>
                        </div>
                        <div id="main-nav"
                             className={`w-full flex-grow lg:flex items-center lg:w-auto ${hidden}`}
                             onClick={() => toggleBurger()}>
                            <div
                                className="text-sm lg:flex-grow mt-2 animated jackinthebox xl:mx-8">
                                <NavItem current={loc.pathname === PATHS.USERS}
                                         href={PATHS.USERS}>Users</NavItem>
                            </div>
                            <NavItem current={false}
                                     href={PATHS.LOGIN}>Logout</NavItem>
                        </div>
                    </nav>
                </div>
            </div>
        </header>
    );
}

export default Navbar;