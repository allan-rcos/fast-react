import React from 'react';
import ClassName from "../../helpers/ClassName";

function IconButton({children, color, ...props}) {
    const defaultClassColor = 'hover:bg-slate-900/10 active:bg-slate-900/20 text-slate-900'
    const classColor = ClassName.getColor(color, true);
    return (
        <button
            className={"relative h-10 max-h-[40px] w-10 max-w-[40px] select-none " +
                "rounded-lg text-center align-middle font-sans text-xs " +
                "font-medium uppercase transition-all " +
                " " + classColor + ' ' +
                "disabled:pointer-events-none disabled:opacity-50 " +
                "disabled:shadow-none "}
            type="button" {...props}>
            <span
                className="absolute transform -translate-x-1/2
                    -translate-y-1/2 top-1/2 left-1/2">
                {children}
            </span>
        </button>
    );
}

export default IconButton;