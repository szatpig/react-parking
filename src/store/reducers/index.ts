// Created by szatpig at 2019/8/19.

import { combineReducers } from 'redux'

import user from './user'
import header from './header'
import system from  './system'
import common from  './common'

export default combineReducers({
    user,
    header,
    system,
    common
})


// const ACTION_HANDLERS = {
//     [UPDATE_ARTICLES_DETAIL]: (articles, action) => articles,
//     [UPDATE_ARTICLES_LIST]: (articles, action) => {
//         let payload = action.payload,
//                 normalizeData = payload.normalizeData,
//                 list = articles.list.concat(normalizeData.result),
//                 listLastkey = payload.listLastkey;
//
//         // 更新articles.list字段和articles.lastkey字段
//         // 这儿为什么不是state，而是articles呢？留着后文介绍
//         return updateObject(articles, {
//             list,
//             listLastkey
//         });
//     }
// }
//
// // ------------------------------------
// // Reducer
// // ------------------------------------
// export function articlesReducer(articles = {
//     list: [],
//     listLastkey: 0
// }, action) {
//     const handler = ACTION_HANDLERS[action.type]
//
//     return handler ? handler(articles, action) : articles
// }
