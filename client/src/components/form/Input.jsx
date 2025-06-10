import React from 'react';

function Input({error, width = 'w-full', ...props}) {
    return (
        <input {...props}
               className={`border rounded-lg px-3 py-2 my-1 text-sm ${width} `
                   .concat(error ? 'border-red-500' : '')}/>
    );
}

export default Input;