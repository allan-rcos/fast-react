import React from 'react';
import ClassName from "../helpers/ClassName";

function Banner({title, children, color, ...props}) {
    let classColor = ClassName.getColor(color)

    return (
        <div {...props}
             className={"border-t border-b px-4 py-3 "
                 .concat(classColor)}
             role="alert">
            <p className="font-bold">{title}</p>
            <p className="text-sm">{children}</p>
        </div>
    );
}

export default Banner;