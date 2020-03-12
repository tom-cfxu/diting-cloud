import { Component, ViewChild, OnInit, TemplateRef } from '@angular/core';
import { STColumn, STPage, STChange, STComponent } from '@delon/abc'
import { _HttpClient } from '@delon/theme';
import { RequireService } from '@core/require';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import { ApiService } from '@core/api.service';

@Component({
  selector: 'app-bin-send',
  templateUrl: './bin-send.component.html',
  styles: []
})
export class BinSendComponent implements OnInit {
  // 构造函数
  constructor(private http: _HttpClient, private api: ApiService, private require: RequireService) { }
  private destroy$ = new Subject();
  isVisible = false //显示隐藏弹出框;
  @ViewChild('st', { static: false }) st: STComponent;
  @ViewChild('st2', { static: false }) st2: STComponent;
  @ViewChild('st3', { static: false }) st3: STComponent;
  // 文件列表数据
  binUrl = this.require.api.getBins;
  dtuUrl = this.require.api.getDtus;
  data = [] // 保存表格信息
  pi = 1; // 表格页码
  ps = 10;// 表格每页数量
  total; // 总数据数量
  data2 = [] // 保存添加dtu列表
  pi2 = 1; // 表格页码
  ps2 = 10;// 表格每页数量
  total2; // 总数据数量
  checked = [];
  checked2 = [];
  data3 = [] // 保存dtu下发表数据
  checked3 = [];
  // 分页配置
  pages: STPage = {
    total: '',
    showSize: true,
    showQuickJumper: true,
    front: false,
    pageSizes: [10, 20, 30, 40, 50],
    placement: 'center'
  }
  pages3: STPage = {
    showSize: true,
    showQuickJumper: true,
    pageSizes: [10, 20, 30, 40, 50],
    placement: 'center'
  }
  columns: STColumn[] = [
    {
      type: 'checkbox',
      width: 50,
    },
    {
      title: 'ID',
      index: 'id',
      width: 100,
      sort: {
        compare: (a, b) => a.id - b.id,
      },
    },
    {
      title: '现文件名',
      index: 'nfilename',
      width: 500,
      className: 'text-nowrap,text-truncate'
    },
    {
      title: '原文件名',
      index: 'ofilename',
      width: 450,
      className: 'text-nowrap,text-truncate'
    },
    {
      title: '创建时间',
      index: 'createTime',
      width: 300

    },
    {
      title: '创建人员',
      index: 'createUser',
      width: 150

    },
    {
      title: '拥有',
      index: 'owner',
      width: 75

    },
    {
      title: '描述',
      index: 'description',
      width: 75
    },
    {
      title: '协议版本',
      index: 'protocolVersion',
      width: 75
    },
    {
      title: '驱动版本',
      index: 'driverVersion',
      width: 75

    },
    {
      title: '文件版本',
      index: 'fileVersion',
      width: 75
    },
  ];
  // DTU列表
  columns2: STColumn[] = [
    {
      type: 'checkbox'
    },
    {
      title: '序号',
      index: 'id',
      width: 50,
      sort: {
        compare: (a, b) => a.id - b.id,
      },
    },
    {
      title: 'DTU编号',
      index: 'gatewayNumber',
      width: 300,
      className: 'text-nowrap,text-truncate'
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
      width: 150,
    },
    {
      title: '经度',
      index: 'locateX',
      width: 100,
    },
    {
      title: '纬度',
      index: 'locateY',
      width: 100,
    },
    {
      title: '状态',
      index: 'status',
      width: 100,
    },
    {
      title: '注册时间',
      index: 'createTime',
      width: 150,
    },
  ]
  // DTU下发列表配置
  columns3: STColumn[] = [
    {
      type: 'checkbox'
    },
    {
      title: '序号',
      index: 'id',
      width: 50,
      sort: {
        compare: (a, b) => a.id - b.id,
      },
    },
    {
      title: 'DTU编号',
      index: 'gatewayNumber',
      width: 260,
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
      width: 150,
    },
    {
      title: '经度',
      index: 'locateX',
      width: 100,
    },
    {
      title: '纬度',
      index: 'locateY',
      width: 100,
    },
    {
      title: '状态',
      index: 'status',
      width: 100,
    },
    {
      title: '注册时间',
      index: 'createTime',
      width: 150,
    },
    {
      title: '操作',
      width: 50,
      buttons: [
        {
          text: '删除',
          type: 'del',
          click: (e) => {
            const arr = this.data3;
            for (let i = 0; i < arr.length; i++) {
              if (arr[i].id === e.id) {
                arr.splice(i, 1)
              }
            }
            this.data3 = [...arr];
          }
        }
      ]
    }
  ]
  // 监听表1变化
  change(ret: STChange) {
    if (ret.type === 'pi' || ret.type === 'ps') {
      this.pi = ret.pi;
      this.ps = ret.ps;
      this.getData();
    } else if (ret.type === 'checkbox') {
      this.checked = ret.checkbox.map(e => e.id)
    }
  }
  // 监听表2变化
  change2(ret: STChange) {
    if (ret.type === 'pi' || ret.type === 'ps') {
      this.pi2 = ret.pi;
      this.ps2 = ret.ps;
      this.getDtus();
    } else if (ret.type === 'checkbox') {
      this.checked2 = ret.checkbox.map(e => e.id)
    }
  }
  // 监听表3变化
  change3(ret: STChange) {
    if (ret.type === 'checkbox') {
      this.checked3 = ret.checkbox.map(e => e.id)
    }
  }

  arr = [];
  // 开始下发
  binSend() {
    if (this.checked.length > 0 && this.checked3.length > 0) {
      console.log(this.checked, this.checked3)
      this.api.modalService.confirm({
        nzTitle: '确认下发?',
        nzOnOk: () => {
          console.log('开始下发')
        }
      })
    } else {
      this.api.message.info('需选择下发的bin文件以及DTU')
    }
  }
  // 添加dtu到dtu下发列表
  addDtuApi() {
    for (const item of this.checked2) {
      for (const j of this.data2) {
        if (j.id === item) {
          this.arr.push(j);
        }
      }
    }
    const result = this.require.deteleObject(this.arr);
    this.data3 = result;
    // this.arr.push(rr;
  }
  // 添加dtu按钮
  addDtuBUtton() {
    this.isVisible = true;
  }
  // 获取 dtu列表
  getDtus() {
    const body = this.require.encodeObject({
      page: this.pi2,
      rows: this.ps2
    })
    this.require.post(this.dtuUrl, body).subscribe((res: any) => {
      switch (res.code) {
        case "10005":
          const data = res.data;
          this.pi2 = data.page;
          this.total2 = data.records;
          this.data2 = data.rows.map((e) => {
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
          break;
        default:
          console.log(res)
          break;
      }
    }, (err) => {

    })
  }
  // 获取 文件列表
  getData() {
    const body = this.require.encodeObject({
      page: this.pi,
      rows: this.ps,
    });

    this.require.post(this.binUrl, body).subscribe((res: any) => {
      // console.log(res)
      switch (res.code) {
        case "10005":
          const data = res.data;
          this.pi = data.page;
          this.total = data.records;
          this.data = data.rows.map((e) => {
            return {
              id: e.id,
              nfilename: e.nfilename,
              ofilename: e.ofilename,
              createTime: e.createTime,
              createUser: e.createUser,
              description: e.description,
              owner: e.owner,
              protocolVersion: e.protocolVersion,
              driverVersion: e.driverVersion,
              fileVersion: e.fileVersion,
            }
          });
          break;
        default:
          console.log(res)
          break;
      }
    }, (err) => {
    })
  }
  // 取消按钮
  handleCancel() {
    this.isVisible = false;
  }
  ngOnInit() {
    this.getData();
    this.getDtus();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
