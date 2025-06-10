import React from 'react';

function THeadCell({children, ...props}) {
    return (
        <th {...props}
            className="p-4 transition-colors cursor-pointer border-y border-slate-200 bg-slate-50 hover:bg-slate-100">
            <p
                className="flex items-center justify-between gap-2 font-sans text-sm  font-normal leading-none text-slate-500">
                {children}
                {children &&
                    <svg xmlns="http://www.w3.org/2000/svg"
                         fill="none" viewBox="0 0 24 24"
                         stroke="currentColor"
                         aria-hidden="true"
                         className="w-4 h-4">
                        <path
                            d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"></path>
                    </svg>}
            </p>
        </th>
    );
}

export default THeadCell;