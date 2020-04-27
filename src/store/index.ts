// Created by szatpig at 2019/8/19.
import { createStore, applyMiddleware } from 'redux'
import createLogger from 'redux-logger';
import createSagaMiddleware from 'redux-saga';

import reducers from './reducers'
import rootSagas from './sagas'

const sagaMiddleware = createSagaMiddleware()

const store = createStore(reducers,applyMiddleware(createLogger,sagaMiddleware))

sagaMiddleware.run(rootSagas)

export default store
