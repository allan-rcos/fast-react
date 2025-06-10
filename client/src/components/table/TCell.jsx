import React from 'react';

function TCell({children}) {
    return (
        <td className="p-4 border-b border-slate-200 text-sm">
            {children}
        </td>
    );
}

export default TCell;