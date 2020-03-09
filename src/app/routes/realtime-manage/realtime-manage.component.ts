import { Component, OnInit, ViewChild } from '@angular/core';
import { STColumn, STChange, STPage, STColumnTag } from '@delon/abc';
import { _HttpClient, POST } from '@delon/theme';
import { RequireService } from '@core/require';
import { ApiService } from '@core/api.service';
import { SFComponent, SFSchema, SFGridSchema, SFTextWidgetSchema, SFRadioWidgetSchema, SFSliderWidgetSchema } from '@delon/form';

const TAG: STColumnTag = {
  true: { text: 'true', color: 'blue' },
  false: { text: 'false', color: '' }
};
@Component({
  selector: 'app-realtime-manage',
  templateUrl: './realtime-manage.component.html',
  styles: []
})
export class RealtimeManageComponent implements OnInit {
  constructor(private require: RequireService, private http: _HttpClient, private api: ApiService) { }
  data = [];// 保存当前数据
  isVisible = false; // 是否显示添加/编辑对话框
  // 分页配置
  pages: STPage = {
    showSize: true,
    showQuickJumper: true,
    pageSizes: [10, 20, 30, 40, 50],
    placement: 'center'
  }
  // 表单配置项
  @ViewChild('sf', { static: false }) sf: SFComponent;
  // 添加/编辑表单配置项
  ui = {
    width: 250,
    gird: {
      gutter: 2
    }
  }
  schema: SFSchema = {
    // required: ['gatewayNumber', 'userName', 'startTime', 'endTime', 'alarmPush', 'scanPolicy'],
    properties: {
      dtuId: {
        type: 'string',
        title: 'DTU编号',
        readOnly: true,
      },
      uuid: {
        type: 'string',
        title: '唯一码',
        readOnly: true,

      },
      region: {
        type: 'string',
        title: '区域',
        readOnly: true,
      },
      upup_limit: {
        type: 'number',
        title: '高高报警',

      },
      up_limit: {
        type: 'number',
        title: '高报警',

      },
      low_limit: {
        type: 'number',
        title: '低报警',
      },
      lowlow_limit: {
        type: 'number',
        title: '低低报警',
      },
      value: {
        type: 'number',
        title: '设置当前值',
      },
      switch_alarm: {
        type: 'string',
        title: '开关量',
        enum: [
          { label: '为0报警', value: '为0报警' },
          { label: '为1报警', value: '为1报警' },
          { label: '变位报警', value: '变位报警' },
        ],
      },
      enabled: {
        type: 'boolean',
        title: '启用报警',
      },
    },
  }
  columns: STColumn[] = [
    {
      title: '选中',
      type: 'checkbox'
    },
    {
      title: 'DTUID',
      index: 'dtuId',
      sort: {
        compare: (a, b) => a.dtuId - b.dtuId,
      },
    },
    {
      title: '设备ID',
      index: 'equipId',
    },
    {
      title: '唯一码',
      index: 'uuid',
    },
    {
      title: '区域',
      index: 'region',
    },
    {
      title: '地址',
      index: 'adress',
    },
    {
      title: '描述',
      index: 'desc',
    },
    {
      title: '启用警报',
      index: 'enabled',
      type: 'tag',
      tag: TAG
    },
    {
      title: '高高报警',
      index: 'upup_limit',
    },
    {
      title: '高报警',
      index: 'up_limit',
    },
    {
      title: '低报警',
      index: 'low_limit',
    },
    {
      title: '低低报警',
      index: 'lowlow_limit',
    },
    {
      title: '开关量报警',
      index: 'switch_alarm',
    },
    {
      title: '当前值',
      index: 'value',
    },
    {
      title: '操作',
      buttons: [
        {
          text: '编辑',
          click: (e) => {
            this.isVisible = true;
            let properties = this.schema.properties;
            properties.dtuId.default = e.dtuId;
            properties.uuid.default = e.uuid;
            properties.region.default = e.region;
            properties.enabled.default = e.enabled;
            properties.upup_limit.default = e.upup_limit;
            properties.up_limit.default = e.up_limit;
            properties.low_limit.default = e.low_limit;
            properties.lowlow_limit.default = e.lowlow_limit;
            properties.switch_alarm.default = e.switch_alarm;
            properties.value.default = e.value;
            this.sf.refreshSchema();

          }
        },
      ]
    },
  ];

  // mock 数据
  // mockData() {
  //   const url = 'http://mengxuegu.com:7300/mock/5d8ed6df993a01623de5b51b/getRealtimeData';
  //   const options = { headers: { 'Content-Type': 'application/json; charset=utf-8' } }
  //   this.http.post(url, null, null, options).subscribe((res) => {
  //     this.data = res.data;
  //   })
  // }
  // 获取所有实时数据
  getRealtimeData() {
    const url = this.require.api.getAllRDB;
    this.require.post(url).subscribe((res: any) => {
      console.log(res);
      switch (res.code) {
        case "10005":
          const data = res.data
          if (data.rows.length > 0) {
            this.data = data.map((e) => {
              return {
                dtuId: e.dtuId,
                equipId: e.equipId,
                uuid: e.uuid,
                region: e.region,
                address: e.address,
                desc: e.desc,
                enabled: e.enabled,
                upup_limit: e.upup_limit,
                up_limit: e.up_limit,
                low_limit: e.low_limit,
                lowlow_limit: e.lowlow_limit,
                switch_alarm: e.switch_alarm,
                value: e.value,
              }
            })
          } else {
            this.data = [];
            this.api.message.info('数据为空', { nzDuration: 1000 })
          }

          break;
        case "10006":
          console.log(res)
          break;
      }
    }, (err) => {

    })
  }
  // 编辑表单提交
  editData(value) {
    const url = this.require.api.realtimeEdit;
    const body = this.require.encodeObject(value)
    this.require.post(url, body).subscribe((res: any) => {
      switch (res.data) {
        case "10005":
          break;
        default:
          console.log(res)
          break;
      }
    }, (err) => {

    })
  }
  // 关闭对话框
  handleCancel() {
    this.isVisible = false
  }
  ngOnInit(): void {
    // this.mockData();
    this.getRealtimeData();
  }
}

