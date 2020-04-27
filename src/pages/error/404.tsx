// Created by szatpig at 2019/8/20.
import React, {Component} from 'react'
import { Result, Button } from 'antd';

interface Props {
}

interface State {
}

class NotFound extends Component<Props, State> {

    render() {
        return (
                <Result
                    className="not-found-container"
                    status={ 404 }
                    title="404"
                    subTitle="Sorry, the page you visited does not exist."
                    extra={<Button type="primary">Back Home</Button>}
                />
        )
    }
}

export default NotFound