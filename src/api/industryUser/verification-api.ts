// Created by szatpig at 2019/9/5.

import fetch from '@/utils/fetch'
import site from '@/utils/config'

export const equityVerifyRecordList= (data:any) => fetch(site.base + '/equityVerifyRecord/list' ,{
    type: 'post',
    data
});

export const equityVerifyRecordStatistics= (data:any) => fetch(site.base + '/equityVerifyRecord/statistics' ,{
    type: 'post',
    data
});

export const equityVerifyRecordExport= (data:any) => fetch(site.base + '/equityVerifyRecord/export' ,{
    type: 'post',
    data
});