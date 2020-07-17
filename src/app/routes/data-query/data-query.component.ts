import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { STChange, STPage, STColumn, STComponent } from '@delon/abc';
import { RequireService } from '@core/require';
import { _HttpClient } from '@delon/theme';
import { ApiService } from '@core/api.service';
import axios from 'axios'
import { SFSchema, SFComponent, SFSelectWidgetSchema } from '@delon/form';
let DESC = [];
let UNIT = [];
let DATA = [];
@Component({
  selector: 'app-data-query',
  templateUrl: './data-query.component.html',
  styles: [],
})
export class DataQueryComponent implements OnInit {
  constructor(private require: RequireService, public http: _HttpClient, private api: ApiService) { }
  deleteUrl = this.require.api.selectionDelete;
  data = []; // 保存表格信息
  data2 = []; // 保存报表数据
  pi = 1; // 表格页码
  ps = 5; // 表格每页数量
  total;
  option: any;
  radioValue = 'range'; // 报表查询方式
  @ViewChild('st', { static: false }) st: STComponent;
  // 分页配置
  checked = []; // 选择1
  labelArr = []; // 标签名数组;
  pages: STPage = {
    showSize: true,
    showQuickJumper: true,
    pageSizes: [5, 10, 20, 30, 40, 50],
    placement: 'center',
  };
  //虚拟数据
  mock = {
    "code": "10005",
    "data":
    {
      "equipParam": "1",
      "equipPort": "2",
      "equipProtocol": "3",
      "properties": [
        {
          "createTime": "324",
          "dtuAddress": "345",
          "dtuSection": "56",
          "id": "43007",
          "propertyAddress": "567",
          "propertyDesc": "2344",
          "propertyDisplay": "235",
          "propertyRW": "324",
          "propertySection": "4235",
          "propertyType": "234",
          "propertyUnit": "235",
          "updateTime": "235",
          "uploadMode": "235",
          "uploadParam1": "235",
          "uploadParam2": "235",
          "uploadParam3": "235"
        },
        {
          "id": 43007,
          "propertyType": 'DIN',
          "propertySection": 'DO',
          "propertyAddress": 1,
          "propertyDisplay": null,
          "propertyDesc": 'DO1',
          "propertyUnit": 'none',
          "propertyRw": 'RW',
          "dtuSection": 'DO',
          "dtuAddress": 1,
          "uploadMode": 1,
          "uploadParam1": 60,
          "uploadParam2": 'N',
          "uploadParam3": '-1',
          "createTime": '2020-06-28 03:14:35',
          "updateTime": null,

        },
      ]
    },
    "msg": ""
  };
  // 自选列表配置
  columns: STColumn[] = [
    {
      type: 'checkbox',
    },
    {
      title: '操作',
      buttons: [
        {
          text: '删除',
          type: 'del',
          click: e => {
            let body;
            if (e.id) {
              body = this.require.encodeArray([e.id], 'ids');
            }
            this.require.post(this.deleteUrl, body).subscribe(
              (res: any) => {
                switch (res.code) {
                  case '10005':
                    if (this.total % this.ps === 1 && this.pi > 1) this.pi--;
                    this.getMySelection();
                    break;
                  default:
                    console.log(res);
                    break;
                }
              },
              err => { },
            );
          },
        },
      ],
    },
    {
      title: '属性编号',
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
  // 报表st配置
  columns2: STColumn[] = [
    {
      title: '时间',
      index: 'time',
    },
  ];
  // @ViewChild('sf2', { static: false }) sf2: SFComponent;
  // 日期查询表单
  schema: SFSchema = {
    required: ['startTime', 'endTime', 'type'],
    properties: {
      startTime: {
        type: 'string',
        title: '起始时间',
        ui: {
          widget: 'date',
          // end: 'endTime',
          showTime: true,
          placeholder: '选择时间',
        },
      },
      endTime: {
        type: 'string',
        title: '结束时间',
        ui: {
          widget: 'date',
          showTime: true,
          placeholder: '选择时间',
        },
      },
      type: {
        type: 'string',
        title: '类型',
        enum: [
          { label: '默认数据查询', value: 0 },
          { label: '间隔查询-取区间平均数', value: 1 },
          { label: '间隔查询-取区间最大值', value: 2 },
          { label: '间隔查询-取区间最小值', value: 3 },
          { label: '间隔查询-取区间第一个值', value: 4 },
          { label: '区间查询-取区间最后一个值', value: 5 },
        ],
        default: 0,
        ui: {
          widget: 'select',
          // width: 120,
          grid: {
            xs: 4,
            gutter: 1,
            span: 12
          }
        } as SFSelectWidgetSchema,
      },
    },
  };

  // 趋势图查询
  getHistoryData(value) {
    // console.log(value)
    if (!(this.checked.length > 0)) {
      return this.require.message.info('未选择自选记录!', { nzDuration: 1000 });
    }
    const stColumn: STColumn[] = [
      {
        title: '时间',
        index: 'time',
      },
    ];
    for (const i of this.labelArr) {
      const columns = { title: i, index: i };
      stColumn.push(columns);
    }
    this.columns2 = [...stColumn];
    const start = Date.parse(value.startTime);
    const end = Date.parse(value.endTime);
    const hour = (end - start) / (1000 * 60 * 60);
    if (hour < 3) return this.require.message.error('查询时间范围须大于3小时!');
    // if (hour > 5) return this.require.message.error('起始-结束时间范围须在5小时以内!');
    if (hour < 0) return this.require.message.error('结束时间须在开始时间之后!');
    const url = this.require.api.getHistoryData;
    const ids = this.require.encodeArray(this.checked, 'ids');
    const body =
      ids +
      '&' +
      this.require.encodeObject({
        type: value.type,
        startTime: value.startTime,
        endTime: value.endTime,
      });
    this.require.post(url, body).subscribe((res: any) => {
      switch (res.code) {
        case '10005':
          if (res.data != null && res.data.data.length > 0) {
            this.data2 = res.data.data[0].historyData; //报表数据
            const timeArray = []; // 保存时间横轴数据
            const valueArray = []; // 保存所有标签点的数据
            for (let i = 0; i <= this.labelArr.length; i++) {
              valueArray[i] = [];
            }
            // console.log()
            const data = res.data.data; // [0].historyData;
            for (const i of data) {
              const oneData = i;
              const historyDataArray = oneData.historyData;
              for (let j = 0; j < historyDataArray.length; j++) {
                const historyData = historyDataArray[j];
                for (const item in historyData) {
                  if (item == 'time') {
                    timeArray.push(historyData[item]);
                  }
                  for (let n = 0; n < this.labelArr.length; n++) {
                    if (item == this.labelArr[n]) {
                      valueArray[n][j] = historyData[item]; // === null ? 0 : historyData[item];
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
              objArr.push(obj);
            }
            DATA = valueArray;
            this.option.legend.data = this.labelArr;
            this.option.xAxis.data = timeArray;
            this.option.series = objArr;
            // console.log(this.option)
            this.option = { ...this.option };
          } else {
            this.require.message.info('数据为空', { nzDuration: 1000 });
            this.option.legend.data = [];
            this.option.xAxis.data = [];
            this.option.series = [];
            this.option = { ...this.option };
          }
          break;
        default:
          break;
      }
    });
  }
  // 趋势图初始化
  chart() {
    const lineColor = "#ADADAD";
    this.option = {
      color: [
        '#0e72cc',
        '#6ca30f',
        '#f59311',
        '#fa4343',
        '#16afcc',
        '#85c021',
        '#d12a6a',
        '#0e72cc',
        '#6ca30f',
        '#f59311',
        '#fa4343',
        '#16afcc',
      ],
      title: {
        text: '历史数据曲线',
      },
      tooltip: {
        trigger: 'axis',
        formatter: params => {
          let result = '';
          let i = 0;
          result += `${params[0].name}<br/>`;
          params.forEach(item => {
            result += `${item.marker} ${item.seriesName} : ${
              typeof item.value === 'undefined' ? '数据为空' : DESC[i]
              }&nbsp;&nbsp;${typeof item.value === 'undefined' ? ' ' : item.value}&nbsp;${
              typeof item.value === 'undefined' ? ' ' : UNIT[i]
              }
            <br/>`;
            i++;
          });
          return result;
        },
      },
      legend: {
        data: [],
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      toolbox: {
        feature: {
          saveAsImage: {},
        },
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: [],
        axisLine: {
          symbol: ['none', 'arrow'],
          lineStyle: {
            color: lineColor,
            width: 2,
          },
        },
      },
      yAxis: {
        type: 'value',
        axisLine: {
          symbol: ['none', 'arrow'],
          lineStyle: {
            color: lineColor,
            width: 2,
          },
        },
      },
      dataZoom: [
        {
          type: 'slider',
          show: true,
          start: 0,
          end: 100,
          handleSize: 8,
        },
        {
          type: 'inside',
          start: 0,
          end: 100,
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
          left: '98%',
          dataBackground: {
            areaStyle: {
              color: "rgba(24, 144, 255, 1)"
            }
          }
        },
      ],
      series: [],
    };
  }
  // 监听自选列表变化
  change(ret: STChange) {
    this.total = ret.total;
    if (ret.type === 'pi' || ret.type === 'ps') {
      this.pi = ret.pi;
      this.ps = ret.ps;
    } else if (ret.type === 'checkbox') {
      this.labelArr = ret.checkbox.map(e => e.dtuSection + e.dtuAddress);
      DESC = ret.checkbox.map(e => e.propertyDesc);
      UNIT = ret.checkbox.map(e => e.propertyUnit);
      this.checked = ret.checkbox.map(e => e.id);
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
          this.require.post(this.deleteUrl, body).subscribe(
            (res: any) => {
              switch (res.code) {
                case '10005':
                  if ((this.total % this.ps === 1 && this.pi > 1) || this.checked.length === this.total % this.ps)
                    this.pi--;
                  this.getMySelection();
                  this.checked = [];
                  break;
                default:
                  console.log(res);
                  break;
              }
            },
            err => { },
          );
        },
      });
    } else {
      this.api.message.info('未选中记录!');
      return 0;
    }
  }
  // 获取自选列表 数据
  getMySelection() {
    const url = this.require.api.getMySelection;

    this.require.post(url).subscribe(
      (res: any) => {
        switch (res.code) {
          case '10005':
            const data = res.data.properties;
            if (data === null || data === []) {
              this.data = [];
              this.api.message.info('数据为空', { nzDuration: 1000 });
            } else if (data.length > 0) {
              this.data = data
            }
            break;
          default:
            console.log(res);
            break;
        }
      },
      err => { },
    );
  }
  ngOnInit() {
    this.getMySelection();
    this.chart();
  }
}
