import React from 'react';
import IconButton from "./IconButton";

function RemoveButton(props) {
    return (
        <IconButton {...props} color='red'>
            <div className="text-xl">
                &#x1F5D9;
            </div>
        </IconButton>
    );
}

export default RemoveButton;