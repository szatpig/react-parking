// Created by szatpig at 2020/6/16.
import React, {useState, useEffect} from 'react';
import { RouteComponentProps } from "react-router-dom";

function Authorized(props:Props) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        //do something
    });

    return (
            <div className="Authorized-container"></div>
    );
}

interface Props extends RouteComponentProps {
    key:string,
    path:string,
    redirect:string,
    authority:string[],
}


export default Authorized
