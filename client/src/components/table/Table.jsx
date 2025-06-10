import React from 'react';
import {useSearchParams} from "react-router-dom";
import Input from "../form/Input";

function Table({
                   children,
                   title,
                   description,
                   pages,
                   onClickNext,
                   onClickPrevious,
                   onClickFirst,
                   onClickLast,
                   onClickAdd,
               }) {
    const [searchParams, setSearchParams] = useSearchParams()
    const currentPage = searchParams.get('page') ?? 1;
    const limit = searchParams.get('limit') ?? 10
    const min_limit = 1;
    const max_limit = 50;

    const directions = {
        FIRST: 'first',
        PREVIOUS: 'previous',
        NEXT: 'next',
        LAST: 'last'
    }

    const setLimit = (new_value) => {
        let new_value_int = parseInt(new_value);
        if (!new_value || isNaN(new_value_int)) return
        if (min_limit > new_value_int || max_limit < new_value_int) return
        searchParams.set('limit', new_value.toString())
        setSearchParams(searchParams)
    }

    const paginate = (direction) => {
        let cursor = searchParams.get('page');
        cursor = cursor ? parseInt(cursor) : 1
        direction = direction.toLowerCase()
        switch (direction) {
            case directions.FIRST:
                cursor = 1;
                if (onClickFirst != null)
                    onClickFirst(cursor)
                break;
            case directions.PREVIOUS:
                cursor -= 1
                if (onClickPrevious != null)
                    onClickPrevious(cursor)
                break;
            case directions.NEXT:
                cursor += 1
                if (onClickNext != null)
                    onClickNext(cursor)
                break;
            case directions.LAST:
                cursor = pages
                if (onClickLast != null)
                    onClickLast(cursor)
                break;
            default:
                throw RangeError("Unknown direction: ".concat("'", direction, "'",
                    " Expected: '", Object.values(directions).join("', '"), "'"))
        }
        searchParams.set('page', cursor.toString())
        setSearchParams(searchParams)
    }
    return (
        <>
            <div className="max-w-[720px] mx-auto">
                <div
                    className="relative flex flex-col w-full h-full text-slate-700 bg-white shadow-xl rounded-xl bg-clip-border">
                    <div
                        className="relative mx-4 mt-4 overflow-hidden text-slate-700 bg-white rounded-none bg-clip-border mb-4">
                        <div className="flex items-center justify-between ">
                            <div>
                                <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
                                {description &&
                                    <p className="text-slate-500">{description}</p>}
                            </div>
                            <div
                                className="flex flex-col gap-2 shrink-0 sm:flex-row">
                                <button onClick={onClickAdd}
                                        className="flex select-none items-center rounded-full size-10 bg-green-600 py-2.5 px-4 text-xs font-semibold text-white shadow-md transition-all hover:shadow-lg hover:bg-green-500 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                                        type="button">
                                    &#x2b;
                                </button>
                            </div>
                        </div>

                    </div>
                    <div className="p-0 overflow-auto">
                        {
                            !!children && <table
                                className="w-full text-left table-auto min-w-max">
                                {children}
                            </table>
                        }
                        {
                            !children && <div
                                className="text-center py-5 border-y-2 border-gray-100">
                                Nothing to show
                            </div>
                        }
                    </div>
                    <div className="flex items-center justify-between p-3">
                        <div
                            className="flex items-center text-sm text-slate-500">
                            <p className="block mr-3">
                                Page {currentPage} of {pages}
                            </p>
                            <label htmlFor='limit'
                                   className='mr-1'>Limit: </label>
                            <Input type="number" width="w-16" name='limit'
                                   min={min_limit} max={max_limit} value={limit}
                                   onChange={(e) => setLimit(parseInt(e.target.value))}/>
                        </div>
                        <div className="flex gap-1">
                            <button
                                onClick={() => paginate(directions.FIRST)}
                                disabled={currentPage <= 1}
                                className="rounded border border-slate-300 py-2.5 px-3 text-center text-xs font-semibold text-slate-600 transition-all hover:opacity-75 focus:ring focus:ring-slate-300 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                                type="button">
                                First
                            </button>
                            <button
                                onClick={() => paginate(directions.PREVIOUS)}
                                disabled={currentPage <= 1}
                                className="rounded border border-slate-300 py-2.5 px-3 text-center text-xs font-semibold text-slate-600 transition-all hover:opacity-75 focus:ring focus:ring-slate-300 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                                type="button">
                                Previous
                            </button>
                            <button
                                onClick={() => paginate(directions.NEXT)}
                                disabled={currentPage >= pages}
                                className="rounded border border-slate-300 py-2.5 px-3 text-center text-xs font-semibold text-slate-600 transition-all hover:opacity-75 focus:ring focus:ring-slate-300 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                                type="button">
                                Next
                            </button>
                            <button
                                onClick={() => paginate(directions.LAST)}
                                disabled={currentPage >= pages}
                                className="rounded border border-slate-300 py-2.5 px-3 text-center text-xs font-semibold text-slate-600 transition-all hover:opacity-75 focus:ring focus:ring-slate-300 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                                type="button">
                                Last
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Table;