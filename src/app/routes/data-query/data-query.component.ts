import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { STChange, STPage, STColumn, STComponent } from '@delon/abc';
import { RequireService } from '@core/require';
import { _HttpClient } from '@delon/theme';
import { ApiService } from '@core/api.service';
import { SFSchema, FormProperty, PropertyGroup, SFDateWidgetSchema, } from '@delon/form';
declare var G2: any;
@Component({
  selector: 'app-data-query',
  templateUrl: './data-query.component.html',
  styles: []
})
export class DataQueryComponent implements OnInit {
  constructor(private require: RequireService, private http: _HttpClient, private api: ApiService) { }
  getMySelection = this.require.api.getMySelection;
  deleteUrl = this.require.api.selectionDelete;
  data = []; // 保存表格信息
  pi = 1; // 表格页码
  ps = 5;// 表格每页数量
  gatewayNumber = ""; //保存趋势图标题
  @ViewChild('st', { static: false }) st: STComponent;
  // 分页配置
  checked = [];// 选择1
  pages: STPage = {
    showSize: true,
    showQuickJumper: true,
    pageSizes: [5, 10, 20, 30, 40, 50],
    placement: 'center'
  }
  // G2图表
  chartData: any[] = [];
  // 自选列表配置
  columns: STColumn[] = [
    {
      type: 'checkbox'
    },
    {
      title: 'DTU编号',
      index: 'id',
      sort: {
        compare: (a, b) => a.id - b.id,
      },
    },
    {
      title: '属性类型',
      index: 'propertyType',
    },
    {
      title: '属性区域',
      index: 'propertySection',
    },
    {
      title: '属性地址',
      index: 'propertyAddress',

    },
    {
      title: 'DTU区域',
      index: 'dtuSection',

    },
    {
      title: 'DTU地址',
      index: 'dtuAddress',

    },
    {
      title: '属性描述',
      index: 'propertyDesc',

    },
    {
      title: '属性单位',
      index: 'propertyUnit',

    },
    {
      title: '操作',
      buttons: [
        {
          text: '删除',
          type: 'del',
          click: (e) => {
            let body;
            if (e.id) {
              body = this.require.encodeArray([e.id], 'ids');
            }
            this.require.post(this.deleteUrl, body).subscribe((res: any) => {
              switch (res.code) {
                case '10005':
                  this.getData();
                  break;
                default:
                  console.log(res);
                  break;
              }
            }, (err) => {

            })
          }
        }
      ]
    },
  ];
  // 查询表单
  schema: SFSchema = {
    required: ['startTime', 'endTime'],
    properties: {
      startTime: {
        type: 'string',
        title: '起始-结束时间',
        ui: {
          widget: 'date',
          end: 'endTime', showTime: true
        } as SFDateWidgetSchema,
      },
      endTime: {
        type: 'string',
        ui: {
          widget: 'date',
          // end: 'endTime',
          showTime: true,
          // validator: (value: any) => { return [{ keyword: 'required', message: '起始-结束时间不能超过1天！' }] }
        }
      },
    }
  };
  // 提交搜索
  submit(value) {
    if (!(this.checked.length > 0)) {
      return this.require.message.info('未选择自选记录!', { nzDuration: 1000 })
    }
    const url = this.require.api.getHistoryData;
    const ids = this.require.encodeArray(this.checked, 'ids')
    const body = ids + '&' + this.require.encodeObject({
      startTime: value.startTime,
      endTime: value.endTime,
    })
    this.require.post(url, body).subscribe((res: any) => {
      switch (res.code) {
        case '10005':
          console.log(res)
          if (res.data.data.length > 0) {
            this.gatewayNumber = res.data.data[0].gatewayNumber;
            const data = res.data.data[0].historyData;
            this.chartData = data.map((e) => {
              return {
                'x': Date.parse(e.time),
                'y1': e.ND6 == null ? "0.0" : e.ND6
              }
            })
          } else {
            this.require.message.info('数据为空', { nzDuration: 1000 })
          }
          console.log(this.chartData)
          break;
        default:
          break;
      }
    })
  }
  // 监听变化
  change(ret: STChange) {
    if (ret.type === 'pi' || ret.type === 'ps') {
      this.pi = ret.pi;
      this.ps = ret.ps;
    } else if (ret.type === 'checkbox') {
      this.checked = ret.checkbox.map(e => e.id)
    }
  }
  // 删除多选数据
  deletueButton() {
    if (this.checked.length > 0) {
      this.api.modalService.confirm({
        nzTitle: '删除提示',
        nzContent: '确定删除所选的记录吗?',
        nzOnOk: () => {
          const body = this.require.encodeArray(this.checked, 'ids');
          this.require.post(this.deleteUrl, body).subscribe((res: any) => {
            switch (res.code) {
              case '10005':
                this.getData();
                break;
              default:
                console.log(res);
                break;
            }
          }, (err) => {

          })
        },
      })
    } else {
      this.api.message.info('未选中记录!')
      return 0;
    }
  }
  // 获取历史数据
  getData() {
    const url = this.require.api.getMySelection;
    this.require.post(url).subscribe((res: any) => {
      // console.log(res)
      switch (res.code) {
        case "10005":
          const data = res.data;
          this.pi = data.page;
          if (data.properties.length > 0) {
            this.data = data.properties.map((e) => {
              return {
                id: e.id,
                equipListId: e.equipListId,
                propertyType: e.propertyType,
                propertySection: e.propertySection,
                propertyAddress: e.propertyAddress,
                propertyDesc: e.propertyDesc,
                propertyUnit: e.propertyUnit,
                propertyRW: e.propertyRW,
                dtuSection: e.dtuSection,
                dtuAddress: e.dtuAddress,
                uploadMode: e.uploadMode,
                uploadParam1: e.uploadParam1,
                uploadParam2: e.uploadParam2,
                uploadParam3: e.uploadParam3,
                createTime: e.createTime,
                updateTime: e.updateTime,
              }
            })
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

  ngOnInit() {
    this.getData();
    // for (let i = 0; i < 20; i += 1) {
    // this.chartData.push({
    //   x: (new Date().getTime()) + (1000 * 60 * 30 * i),
    //   y1: Math.floor(Math.random() * 100) + 1000,
    //   y2: Math.floor(Math.random() * 100) + 10,
    // });
    // }
  }
}
