import React from 'react';
import {Navigate, Outlet, useLocation} from "react-router-dom";
import PATHS from "../../config/PATHS";
import Token, {TokenError} from "../../helpers/Token";

function Authenticated() {
    const location = useLocation();

    try {
        let token = Token.token;
        Token.setRefreshTimeout();
        if (token)
            return <Outlet/>;
    } catch (error) {
        if (!(error instanceof TokenError))
            throw error
        return (<Navigate to={PATHS.LOGIN} state={{from: location}} replace/>);
    }
}

export default Authenticated;