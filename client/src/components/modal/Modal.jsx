import React from 'react';

function Modal({title, children, onCancel, onConfirm, ...props}) {
    return (
        <>
            <div onClick={onCancel}
                 className="absolute -top-5 left-0 inset-0 h-screen w-screen bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300"
            >
            </div>
            <div {...props}
                 className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 m-4 p-4 w-2/5 min-w-[40%] max-w-[40%] rounded-lg bg-white shadow-sm"
            >
                <div
                    className="flex shrink-0 items-center pb-4 text-xl font-medium text-slate-800">
                    {title}
                </div>
                <div
                    className="relative border-t border-slate-200 py-4 leading-normal text-slate-600 font-light">
                    {children}
                </div>
                <div
                    className="flex shrink-0 flex-wrap items-center pt-4 justify-end">
                    <button onClick={onCancel}
                            className="rounded-md border border-transparent py-2 px-4 text-center text-sm transition-all text-slate-600 hover:bg-slate-100 focus:bg-slate-100 active:bg-slate-100 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                            type="button">
                        Cancel
                    </button>
                    <button onClick={onConfirm}
                            className="rounded-md bg-green-600 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-green-700 focus:shadow-none active:bg-green-700 hover:bg-green-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2"
                            type="button">
                        Confirm
                    </button>
                </div>
            </div>
        </>
    );
}

export default Modal;