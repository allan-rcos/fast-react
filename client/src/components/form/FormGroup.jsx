import React from 'react';
import Label from "./Label";
import Input from "./Input";
import Helper from "./Helper";

function FormGroup({title, helper, ...props}) {
    return (
        <div className="mb-4">
            <Label error={props.error} htmlFor={props.name} children={title}/>
            <Input {...props}/>
            <Helper error={props.error}>{helper}</Helper>
        </div>
    );
}

export default FormGroup;