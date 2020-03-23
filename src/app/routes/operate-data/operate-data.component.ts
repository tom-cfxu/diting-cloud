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

  constructor(private http: _HttpClient, private require: RequireService) { }
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
        title: '起始-结束时间',
        ui: { widget: 'date', end: 'endTime', showTime: true } as SFDateWidgetSchema,
      },
      endTime: {
        type: 'string',
        ui: {
          widget: 'date',
          end: 'endTime',
          showTime: true,
          disabledDate: (current) => console.log(current)
        }
      },
    }
  };
  //提交查询
  submit(value) {
    // console.log(value)
    const url = this.require.api.getOperateData;
    const body = this.require.encodeObject({
      rows: this.ps,
      startTime: value.startTime,
      endTime: value.endTime,
    });
    console.log(body)
    this.require.post(url, body).subscribe((res: any) => {
      // console.log(res)
      const data = res.data;
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
