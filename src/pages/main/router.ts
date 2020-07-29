// Created by szatpig at 2019/8/21.

import common from './router/commonRoute'
import industry from './router/industryRoute'
import admin from './router/adminRoute'
import merchant from './router/merchantRoute'

export default [
    ...industry,
    ...admin,
    ...merchant,
    ...common
]
