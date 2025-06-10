import React from 'react';
import {Link} from "react-router-dom";
import PATHS from "../../config/PATHS";

function NotFound(props) {
    return (
        <div>
            <h1 className="text-4xl mx-10 mt-8 mb-4">Not found: 404</h1>
            <hr/>
            <p className="mx-10 mt-2">Maybe your lost? <Link to={PATHS.USERS} className="text-blue-500 hover:text-blue-400 underline">Redirect</Link></p>
        </div>
    );
}

export default NotFound;