import React from 'react';

function THead({children}) {
    return (
        <thead>
        <tr>
            {children}
        </tr>
        </thead>
    );
}

export default THead;