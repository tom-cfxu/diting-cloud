import { Component, OnInit } from '@angular/core';
import { SFSchema, SFDateWidgetSchema, FormProperty, PropertyGroup } from '@delon/form';
import { _HttpClient } from '@delon/theme';
import { RequireService } from '@core/require';
import { STPage, STChange, STColumn } from '@delon/abc';

@Component({
  selector: 'app-operate-data',
  templateUrl: './operate-data.component.html',
  styles: []
})
export class OperateDataComponent implements OnInit {

  constructor(public http: _HttpClient, private require: RequireService) { }
  data = [];
  pi = 1; // 表格页码
  ps = 10;// 表格每页数量
  checked = []; // 表格选中
  adminId = null;// 当前选中节点id 
  value;
  // 分页配置
  pages: STPage = {
    showSize: true,
    showQuickJumper: true,
    pageSizes: [10, 20, 30, 40, 50],
    placement: 'center'
  }
  // st表格内容
  columns: STColumn[] = [
    {
      title: 'DTUID',
      index: 'dtuId',
      sort: { compare: (a, b) => a.dtuId - b.dtuId, }
    },
    {
      title: '状态',
      index: 'status',
    },
    {
      title: '值',
      index: 'value',
    },
    {
      title: '时间',
      index: 'time',
    }
  ]
  // 查询表单
  schema: SFSchema = {
    required: ['startTime', 'endTime'],
    properties: {
      startTime: {
        type: 'string',
        title: '开始时间',
        // tslint:disable-next-line: no-object-literal-type-assertion
        ui: {
          widget: 'date',
          showTime: true,
          placeholder: '选择时间'
        } as SFDateWidgetSchema,
      },
      endTime: {
        type: 'string',
        title: '结束时间',
        ui: {
          widget: 'date',
          placeholder: '选择时间',
          showTime: true,
        }
      },
    }
  };
  // 提交查询
  submit(value) {
    const start = Date.parse(value.startTime);
    const end = Date.parse(value.endTime);
    const day = (end - start) / (1000 * 60 * 60 * 24);
    if (day > 3) return this.require.message.error('起始-结束时间范围须在3天及以内!');
    if (day < 0) return this.require.message.error('结束时间须在开始时间之后!');
    const url = this.require.api.getOperateData;
    const body = this.require.encodeObject({
      rows: this.ps,
      startTime: value.startTime,
      endTime: value.endTime,
    });
    this.require.post(url, body).subscribe((res: any) => {
      const data = res.data;
      // tslint:disable-next-line: radix
      this.pi = parseInt(data.page);
      if (data.rows.length > 0) {
        this.data = data.rows.map((e) => {
          return {
            dtuId: e.dtuId,
            time: e.time,
            status: e.status,
            value: e.value,

          }
        })
      } else {
        this.data = [];
        this.require.message.info('数据为空', { nzDuration: 1000 })
      }

    }, (err) => {
    })
  }
  // 监听st表格变化
  change(ret: STChange) {
  }
  ngOnInit() {
  }

}
