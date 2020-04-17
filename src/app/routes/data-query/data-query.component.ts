import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { STChange, STPage, STColumn, STComponent } from '@delon/abc';
import { RequireService } from '@core/require';
import { _HttpClient } from '@delon/theme';
import { ApiService } from '@core/api.service';
import { SFSchema, FormProperty, PropertyGroup, SFDateWidgetSchema, SFRadioWidgetSchema, SFComponent, } from '@delon/form';
// import { of } from 'rxjs';
// import { delay } from 'rxjs/operators';
// declare var G2: any;
@Component({
  selector: 'app-data-query',
  templateUrl: './data-query.component.html',
  styles: []
})

export class DataQueryComponent implements OnInit {
  constructor(private require: RequireService, public http: _HttpClient, private api: ApiService) { }
  getMySelection = this.require.api.getMySelection;
  deleteUrl = this.require.api.selectionDelete;
  data = []; // 保存表格信息
  data2 = []; // 保存报表数据
  pi = 1; // 表格页码
  ps = 5;// 表格每页数量
  total;
  option: any;
  radioValue = "range";// 报表查询方式
  @ViewChild('st', { static: false }) st: STComponent;
  // 分页配置
  checked = [];// 选择1
  labelArr = [] // 标签名数组;
  pages: STPage = {
    showSize: true,
    showQuickJumper: true,
    pageSizes: [5, 10, 20, 30, 40, 50],
    placement: 'center',
  }
  // G2图表
  // chartData: any[] = [];
  // 自选列表配置
  columns: STColumn[] = [
    {
      type: 'checkbox'
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
                  if (this.total % this.ps === 1 && this.pi > 1) this.pi--;
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
  ];
  // 报表配置
  columns2: STColumn[] = [
    { title: '时间', index: 'time' }
  ];
  @ViewChild('sf2', { static: false }) sf2: SFComponent;
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
        }
      },
      endTime: {
        type: 'string',
        ui: {
          widget: 'date',
          showTime: true,
        }
      },
    }
  };
  // 查询报表
  schema2: SFSchema = {
    properties: {
      date: {
        type: 'string',
        title: '选择日期',
        format: 'date',
        // tslint:disable-next-line: no-object-literal-type-assertion
        ui: {
          hidden: true,
        }
      },
      // week: {
      //   type: 'string',
      //   title: '选择周',
      //   format: 'week',
      //   ui: {
      //     placeholder: '选择周',
      //     hidden: true,
      //   }
      // },
      // month: {
      //   type: 'string',
      //   title: '选择月',
      //   format: 'month',
      //   ui: {
      //     placeholder: '选择月',
      //     hidden: true,
      //   }
      // },
      startTime: {
        type: 'string',
        title: '起始-结束时间',
        ui: {
          widget: 'date',
          end: 'endTime',
          showTime: true,
          hidden: false,
        },
      },
      endTime: {
        type: 'string',
        ui: {
          widget: 'date',
          showTime: true,
          hidden: true,
        }
      },
    }
  };
  // 报表日期搜索方式切换
  searchBy(e) {
    switch (this.radioValue) {
      case 'range':
        // tslint:disable-next-line: no-string-literal
        this.schema2.properties.startTime.ui['hidden'] = false;
        // tslint:disable-next-line: no-string-literal
        this.schema2.properties.date.ui['hidden'] = true;
        break;
      case 'date':
        // tslint:disable-next-line: no-string-literal
        this.schema2.properties.startTime.ui['hidden'] = true;
        // tslint:disable-next-line: no-string-literal
        this.schema2.properties.date.ui['hidden'] = false;
        break;
    }
    this.sf2.refreshSchema();
  }
  // 趋势图查询提交
  submit(value) {
    if (!(this.checked.length > 0)) {
      return this.require.message.info('未选择自选记录!', { nzDuration: 1000 })
    }
    const start = Date.parse(value.startTime);
    const end = Date.parse(value.endTime);
    const day = (end - start) / (1000 * 60 * 60 * 24);
    if (day > 3) return this.require.message.error('起始-结束时间范围须在3天及以内!');
    const url = this.require.api.getHistoryData;
    const ids = this.require.encodeArray(this.checked, 'ids')
    const body = ids + '&' + this.require.encodeObject({
      startTime: value.startTime,
      endTime: value.endTime,
    })
    this.require.post(url, body).subscribe((res: any) => {
      switch (res.code) {
        case '10005':
          if (res.data.data.length > 0) {
            // this.gatewayNumber = res.data.data[0].gatewayNumber;
            const timeArray = []; // 保存时间横轴数据
            const valueArray = []; // 保存所有标签点的数据
            for (let i = 0; i <= this.labelArr.length; i++) {
              valueArray[i] = [];
            }
            const data = res.data.data// [0].historyData;
            // tslint:disable-next-line: prefer-for-of
            for (const i of data) {
              const oneData = i;
              const historyDataArray = oneData.historyData;
              for (let j = 0; j < historyDataArray.length; j++) {
                const historyData = historyDataArray[j];
                // tslint:disable-next-line: prefer-const
                // tslint:disable-next-line: forin
                for (const item in historyData) {
                  // tslint:disable-next-line: triple-equals
                  if (item == "time") {
                    timeArray.push(historyData[item]);
                  }
                  for (let n = 0; n < this.labelArr.length; n++) {
                    // tslint:disable-next-line: triple-equals
                    if (item == this.labelArr[n]) {
                      valueArray[n][j] = historyData[item] // === null ? 0 : historyData[item];
                    }
                  }
                }
              }
            }
            const objArr = [];
            for (let t = 0; t < this.labelArr.length; t++) {
              const obj: any = {};
              obj.name = this.labelArr[t];
              obj.data = valueArray[t];
              obj.type = 'line';
              objArr.push(obj)
            }
            console.log('开始加载表格')
            this.option.legend.data = this.labelArr
            this.option.xAxis.data = timeArray;
            this.option.series = objArr;
            console.log(this.option)
            this.option = { ...this.option }
          } else {
            // this.gatewayNumber = '';
            this.require.message.info('数据为空', { nzDuration: 1000 })
          }
          break;
        default:
          break;
      }
    })
  }
  // 趋势图初始化
  chart() {
    this.option = {
      title: {
        text: '历史数据曲线'
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: []
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      toolbox: {
        feature: {
          saveAsImage: {}
        }
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: []
      },
      yAxis: {
        type: 'value'
      },
      dataZoom: [
        {
          type: 'slider',
          show: true,
          start: 0,
          end: 100,
          handleSize: 8
        },
        {
          type: 'inside',
          start: 0,
          end: 100
        },
        {
          type: 'slider',
          show: true,
          yAxisIndex: 0,
          filterMode: 'empty',
          width: 12,
          height: '70%',
          handleSize: 8,
          showDataShadow: false,
          left: '98%'
        }
      ],
      series: []
    }
  }
  // 报表查询提交
  submit2(value) {
    if ((JSON.stringify(value) === "{}")) {
      return this.require.message.info('请输入查询时间!', { nzDuration: 1000 })
    }
    const url = this.require.api.getHistoryData;
    const ids = this.require.encodeArray(this.checked, 'ids')
    if (!(this.checked.length > 0)) {
      return this.require.message.info('未选择自选记录!', { nzDuration: 1000 })
    }
    const stColumn: STColumn[] = [{ title: '时间', index: 'time' }];
    for (const i of this.labelArr) {
      const columns = { title: i, index: i }
      stColumn.push(columns)
    }
    // console.log(stColumn);
    // this.columns2.push(stColumn)
    this.columns2 = stColumn;
    const startTime = value.startTime;
    const endTime = value.endTime;
    // const week = value.week;
    // const month = value.month;
    const date = value.date;
    let body = ids + '&';
    if (startTime && endTime) {
      const start = Date.parse(startTime);
      const end = Date.parse(endTime);
      const day = (end - start) / (1000 * 60 * 60 * 24);
      if (day > 3) return this.require.message.error('起始-结束时间范围须在3天及以内!');
      body += this.require.encodeObject({
        startTime,
        endTime
      })
      // } else if (week) {
      //   // console.log(this.require.moment().subtract(week+7-1, 'days').format('YY-ww'))
    }
    else if (date) {
      body += this.require.encodeObject({
        startTime: this.require.moment(date).format('YYYY-MM-DD 00:00:00'),
        endTime: this.require.moment(date).format('YYYY-MM-DD 23:59:59')
      })
    }
    // else if (month) {
    //   body += this.require.encodeObject({
    //     startTime: this.require.moment(month).format('YYYY-MM-DD 00:00:00'),
    //     endTime: this.require.moment(month).add(1, 'months').format('YYYY-MM-DD 00:00:00')
    //   })
    // }
    this.require.post(url, body).subscribe((res: any) => {
      switch (res.code) {
        case '10005':
          if (res.data.data.length > 0) {

            // const data = res.data.data[0].historyData;

          } else {
            this.data2 = [];
            this.require.message.info('数据为空', { nzDuration: 1000 })
          }
          break;
        default:
          break;
      }
    })
  }
  // 监听变化
  change(ret: STChange) {
    this.total = ret.total;
    if (ret.type === 'pi' || ret.type === 'ps') {
      this.pi = ret.pi;
      this.ps = ret.ps;
    } else if (ret.type === 'checkbox') {
      this.labelArr = ret.checkbox.map(e => e.propertySection + e.propertyAddress);
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
                if (this.total % this.ps === 1 && this.pi > 1 || this.checked.length === (this.total % this.ps)) this.pi--;
                this.getData();
                this.checked = [];
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
      switch (res.code) {
        case "10005":
          const data = res.data.properties;
          if (data.length > 0) {
            this.data = data.map((e) => {
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
    this.chart();
  }
}
