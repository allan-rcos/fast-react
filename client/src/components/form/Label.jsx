import React from 'react';

function Label({children, error, ...props}) {
    return (
        <label {...props}
               className={"font-semibold text-sm pb-1 block "
                   .concat(error ? 'text-red-500' : 'text-gray-600')}>
            {children}</label>
    );
}

export default Label;