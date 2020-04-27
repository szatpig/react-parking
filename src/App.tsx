import React from 'react';
import { Provider } from 'react-redux'

import { ConfigProvider } from 'antd';
import zh_CN from 'antd/es/locale-provider/zh_CN';

import './less/index.less'
import store from './store'

import Pages from './pages'

const App: React.FC = () => {
    return (
            <ConfigProvider  locale={zh_CN}>
                <Provider store={ store }>
                    <Pages />
                </Provider>
            </ConfigProvider >
    );
}

export default App;

