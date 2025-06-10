import React from 'react';

function Helper({children, error, ...props}) {
    return (
        <p className={"text-xs ".concat(error ? 'text-red-500' : 'text-gray-500')}
           {...props}>{children}</p>
    );
}

export default Helper;