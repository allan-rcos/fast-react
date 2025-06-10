import React from 'react';

function NavItem({current, children, href}) {
    return (
        <a href={href}
           className={`block lg:inline-block text-md font-bold ${current?'text-orange-500':'text-gray-900'}
               sm:hover:border-indigo-400  hover:text-orange-500 mx-2 focus:text-blue-500  p-1 hover:bg-gray-300
               sm:hover:bg-transparent rounded-lg`}>
            {children}
        </a>
    );
}

export default NavItem;