// Created by szatpig at 2019/8/21.
import React, {useState, useEffect} from 'react';

import { Spin } from 'antd';

function Loading() {
    const [loading, setLoading] = useState(1);

    useEffect(() => {
        //do something
    });

    return (
        <Spin tip="Loading..."></Spin>
    );
}

export default Loading
