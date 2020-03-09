import { Injectable } from '@angular/core';
import { RequireService } from './require';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import { STChange } from '@delon/abc';
import { getLocaleDateFormat } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class ApiService {
    constructor(private require: RequireService, public modalService: NzModalService, public message: NzMessageService) { }

    // 删除功能
    public deleteApi(url, checked?, id?) {
        // console.log(url, checked, id)
        let body;
        if (checked) {
            body = this.require.encodeArray(checked, 'ids');
        }
        if (id) {
            body = this.require.encodeArray([id], 'ids');
        }
        this.require.post(url, body).subscribe((res: any) => {
            switch (res.code) {
                case '10005':
                    break;
                default:
                    console.log(res);
                    break;
            }
        }, (err) => { })
    }

    // 获取dtu列表
    // // 监听表格翻页
    // public change(ret: STChange, url, pi, ps, total, Data) {
    //     if (ret.type === 'pi' || ret.type === 'ps') {
    //         pi = ret.pi;
    //         ps = ret.ps;
    //         this.getData(url, pi, ps, total, Data);
    //     }
    // }
    // 请求主表格数据
    // public getData(url, pi, ps) {
    //     console.log(url, pi, ps)
    //     let total;
    //     let Data;
    //     const body = this.require.encodeObject({
    //         page: pi,
    //         rows: ps,
    //     });

    //     this.require.post(url, body).subscribe((res: any) => {
    //         // console.log(res)
    //         switch (res.code) {
    //             case "10005":
    //                 const data = res.data;
    //                 pi = data.page;
    //                 total = data.records;
    //                 Data = data.rows.map((e) => {
    //                     return {
    //                         id: e.id,
    //                         gatewayNumber: e.gatewayNumber,
    //                         provinceName: e.provinceName,
    //                         cityName: e.cityName,
    //                         areaName: e.areaName,
    //                         detailLocate: e.detailLocate,
    //                         locateX: e.locateX,
    //                         locateY: e.locateY,
    //                         status: e.status,
    //                         createTime: e.createTime,
    //                         updateTime: e.updateTime,
    //                         ownerId: e.ownerId,
    //                     }
    //                 });
    //                 break;
    //             default:
    //                 console.log(res)
    //                 break;
    //         }
    //     }, (err) => {
    //     })
    // }
    // 获取bin文件
    // public getBins() {

    // }

}