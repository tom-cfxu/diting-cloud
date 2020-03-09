import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzFormatEmitEvent, NzTreeNodeOptions } from 'ng-zorro-antd/core';
import { STColumn, STPage, STChange } from '@delon/abc';
import { RequireService } from '@core/require';
import { ApiService } from '@core/api.service';
import { resolve } from 'url';
// tslint:disable-next-line: no-empty-interface
@Component({
  selector: 'app-dtu-online',
  templateUrl: './dtu-online.component.html',
  styles: []
})
export class DtuOnlineComponent implements OnInit {
  constructor(http: _HttpClient, private api: ApiService, private require: RequireService) { this.http = http }
  http;
  // 主表格配置
  data = [] // 保存表格信息
  nodes: NzTreeNodeOptions[] = [];// 节点数据
  pi = 1; // 表格页码
  ps = 5;// 表格每页数量
  total; // 总数据数量
  adminId;
  // 分页配置
  pages: STPage = {
    total: '',
    showSize: true,
    showQuickJumper: true,
    front: false,
    pageSizes: [5, 10, 20, 30, 40, 50],
    placement: 'center'
  }
  // 每列项详细
  columns: STColumn[] = [
    // {
    //   type: 'checkbox',
    //   // title: '',
    //   // index: '',
    //   width: 10,
    // },
    {
      title: '序号',
      index: 'id',
      width: 80,
      // className: 'text-nowrap,text-truncate',
      sort: {
        compare: (a, b) => a.id - b.id,
      },
    },
    {
      title: 'DTU编号',
      index: 'gatewayNumber',
      width: 100,
      // className: 'text-nowrap,text-truncate'

    },
    {
      title: '省',
      index: 'provinceName',
      width: 100,
    },
    {
      title: '市',
      index: 'cityName',
      width: 100,

    },
    {
      title: '区',
      index: 'areaName',
      width: 100,

    },
    {
      title: '详细地址',
      index: 'detailLocate',
      width: 100,
    },
    {
      title: '经度',
      index: 'locateX',
      width: 50,
      // className: 'text-nowrap,text-truncate'
    },
    {
      title: '纬度',
      index: 'locateY',
      width: 50,
      // className: 'text-nowrap,text-truncate'
    },
    {
      title: '状态',
      index: 'status',
      width: 50,
    },
    {
      title: '注册时间',
      index: 'createTime',
      width: 100,
    },
  ]
  // 子表格配置
  data2 = [];// 保存表格信息
  columns2: STColumn[] = [
    {
      title: 'ID',
      index: 'id',
      sort: {
        compare: (a, b) => a.id - b.id,
      },
    },
    {
      title: '设备编号',
      index: 'equipId',

    },
    {
      title: '设备参数',
      index: 'equipParam',
    },
    {
      title: '设备端口',
      index: 'equipPort',

    },
    {
      title: '设备协议',
      index: 'equipProtocol',

    },
    {
      title: '操作',
      buttons: [
        {
          text: '查看设备属性',
          type: 'link',
          click: (e: any) => {
            this.getPropertiesWithEquip(e.equipId);
          }
        }
      ]
    },
  ];
  // 属性表格设置
  data3 = [];
  columns3: STColumn[] = [
    {
      type: 'checkbox'
    },
    {
      title: 'ID',
      index: 'id',
      sort: {
        compare: (a, b) => a.id - b.id,
      },
    },
    {
      title: '类型',
      index: 'propertyType',

    },
    {
      title: '区域',
      index: 'propertySection',

    },
    {
      title: '地址',
      index: 'propertyAddress',

    },
    {
      title: '描述',
      index: 'propertyDesc',

    },
    {
      title: '单位',
      index: 'propertyUnit',

    },
    {
      title: '读写',
      index: 'propertyRW',

    },
    {
      title: 'dtu区域',
      index: 'dtuSection',

    },
    {
      title: 'dtu地址',
      index: 'dtuAddress',

    },
    {
      title: '上传模式',
      index: 'uploadMode',

    },
    {
      title: '上传参数一',
      index: 'uploadParam1',

    },
    {
      title: '上传参数二',
      index: 'uploadParam2',

    },
    {
      title: '上传参数三',
      index: 'uploadParam3',

    },
    {
      title: '加入自选',
      buttons: [
        {
          text: '加入自选',
          type: 'link',
          pop: true,
          popTitle: '确定添加到自选吗?',
          click: (e) => {
            // console.log(e)
            this.addToMySelection(e.id)
          }
        }
      ]
    },
  ];
  // 请求管理员节点
  // 递归修改节点名称
  edit(obj) {
    obj.title = obj.name;
    obj.key = obj.id;
    if (obj.additionalParameters) {
      Object.keys(obj).forEach((key) => {
        const arr = [];
        obj.selected = obj.additionalParameters.itemSelected;
        // tslint:disable-next-line: forin
        for (const i in obj.additionalParameters.children) {
          arr.push(obj.additionalParameters.children[i])
          this.edit(obj.additionalParameters.children[i]);
        }
        obj.children = arr;

      })
    } else {
      obj.isLeaf = true;
    }
    return obj;
  }
  // 获取父子节点
  getNode() {
    const url = this.require.api.loadAdminTreeData;
    this.require.post(url).subscribe((res: any) => {
      const data = res.data.adminTreeData;

      let obj;
      // tslint:disable-next-line: forin
      for (const i in data) {
        obj = data[i];
      }
      this.nodes = [this.edit(obj)];
      // 设置管理员id 和 默认userName
      this.getData();
    }, (err) => {

    })
  }
  // 节点点击
  nzEvent(event: NzFormatEmitEvent): void {
    this.pi = 1;
    this.ps = 5;
    this.adminId = event.node.key;
    this.getData()
  }
  // 请求主表格数据
  getData() {
    const url = this.require.api.getDtus;
    const body = this.require.encodeObject({
      adminId: this.adminId,
      page: this.pi,
      rows: this.ps,
    });
    this.require.post(url, body).subscribe((res: any) => {
      switch (res.code) {
        case "10005":
          const data = res.data;
          this.pi = data.page;
          this.total = data.records;
          if (data.rows.length > 0) {
            this.data = data.rows.map((e) => {
              return {
                id: e.id,
                gatewayNumber: e.gatewayNumber,
                provinceName: e.provinceName,
                cityName: e.cityName,
                areaName: e.areaName,
                detailLocate: e.detailLocate,
                locateX: e.locateX,
                locateY: e.locateY,
                status: e.status,
                createTime: e.createTime,
                updateTime: e.updateTime,
                ownerId: e.ownerId,
              }
            });
          } else {
            this.data = [];
            this.api.message.info('数据为空', { nzDuration: 1000 })
          }
          break;
        default:
          console.log(res)
          break;
      }

    }, (err) => {

    })
  }
  // 查找DTU下属设备
  getEquipsWithDtu(gatewayNumber) {
    const url = this.require.api.getEquipsWithDtu;
    const body = this.require.encodeObject({
      gatewayNumber
    });
    try {
      this.require.post(url, body).subscribe((res: any) => {
        switch (res.code) {
          case '10005':
            console.log(res);
            const data = res.data;
            if (data.list.length > 0) {
              this.data2 = data.list.map((e) => {
                return {
                  id: e.id,
                  gatewayListId: e.gatewayListId,
                  equipListId: e.equipListId,
                  equipId: e.equipId,
                  equipParam: e.equipParam,
                  equipPort: e.equipPort,
                  equipProtocol: e.equipProtocol,
                  openId: e.openId,
                  createTime: e.createTime,
                  updateTime: e.updateTime,
                  properties: e.properties
                }
              });
            } else {
              this.data2 = [];
              this.api.message.info('数据为空', { nzDuration: 1000 })
            }
            break;
          default:
            console.log(res);
            break;
        }
      }, (err) => {

      })
    } catch (err) {
      console.log(err)
    }
  }

  //查找设备所有属性
  getPropertiesWithEquip(id) {
    const url = this.require.api.getPropertiesWithEquip;
    const body = this.require.encodeObject({
      id
    });
    this.require.post(url, body).subscribe((res: any) => {
      switch (res.code) {
        case '10005':
          console.log(res);
          const data = res.data;
          if (data.properties.length > 0) {
            this.data3 = data.properties.map((e) => {
              return {
                id: e.id,
                propertyType: e.propertyType,
                propertySection: e.propertySection,
                propertyAddress: e.propertyAddress,
                propertyDesc: e.propertyDesc,
                propertyUnit: e.propertyUnit,
                propertyRW: e.propertyRW,
                dtuSection: e.dtuSection,
                dtuAddress: e.dtuAddress,
                uploadMode: e.uploadMode,
                updateTime: e.updateTime,
                uploadParam1: e.uploadParam1,
                uploadParam2: e.uploadParam2,
                uploadParam3: e.uploadParam3,
                createTime: e.createTime,
              }
            });
          } else {
            this.data3 = [];
            this.api.message.info('数据为空', { nzDuration: 1000 })
          }
          setTimeout(() => {
            const scroll = document.getElementById('scroll');
            window.scrollTo(0, scroll.scrollHeight + 200)
          }, 50)
          break;
        default:
          console.log(res);
          break;
      }
    }, (err) => {

    })

  }
  // 添加到自选
  addToMySelection(id) {
    const url = this.require.api.addToMySelection;
    const body = this.require.encodeObject({
      propertyId: id
    })
    this.require.post(url, body).subscribe((res: any) => {
      switch (res.code) {
        case "10005":
          console.log(res)
          break;
        default:
          console.log(res)
          break;
      }
    }, (err) => {

    })
  }
  // 监听变化
  change(ret: STChange) {
    // console.log(ret)
    if (ret.type === 'pi' || ret.type === 'ps') {
      this.pi = ret.pi;
      this.ps = ret.ps;
      this.getData();
    } else if (ret.type === "expand" && ret.expand.expand) {
      this.getEquipsWithDtu(ret.expand.gatewayNumber);
    }
  }
  ngOnInit() {
    this.adminId = this.require.settingsService.user.id;
    this.getNode();
  }

}
