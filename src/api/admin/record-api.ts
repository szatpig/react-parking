// Created by szatpig at 2019/9/5.

import fetch from '@/utils/fetch'
import site from '@/utils/config'

export const saleRecordList= (data:any) => fetch(site.base + '/merchantUserCoupon/selectSellLogListWithPage' ,{
    type: 'post',
    data
});

export const saleRecordExport= (data:any) => fetch(site.base + '/merchantUserCoupon/ExportSellLog' ,{
    type: 'post',
    data
});