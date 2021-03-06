import { Component, OnInit } from '@angular/core';
import { STPage, STColumn, STChange } from '@delon/abc';
import { RequireService } from '@core/require';
import { _HttpClient } from '@delon/theme';
import { ApiService } from '@core/api.service';

@Component({
  selector: 'app-alarm-history',
  templateUrl: './alarm-history.component.html',
  styles: []
})
export class AlarmHistoryComponent implements OnInit {
  constructor(private require: RequireService, private api: ApiService, public http: _HttpClient) { }
  url = this.require.api.getAlarmHistory;
  data = [] // 保存表格信息
  pi = 1; // 表格页码
  ps = 10;// 表格每页数量
  total; // 总数据数量
  // 分页配置
  checked = [];// 选择1
  pages: STPage = {
    total: '',
    showSize: true,
    showQuickJumper: true,
    front: false,
    pageSizes: [10, 20, 30, 40, 50],
    placement: 'center'
  }
  //st表格配置
  columns: STColumn[] = [
    {
      title: 'DTUID',
      index: 'dtuId',
      sort: { compare: (a, b) => a.dtuId - b.dtuId }
    },
    {
      title: '设备ID',
      index: 'tortoisegit',
    },
    {
      title: '标签区域',
      index: 'regionType',
    },
    {
      title: '描述',
      index: 'desc',
    },
    {
      title: '报警类型',
      index: 'alarmType',
    },
    {
      title: '报警起始时间',
      index: 'alarmStartTime',
    },
    {
      title: '报警值',
      index: 'value',
    },
    {
      title: '报警处理',
      index: 'alarmProcess',
    },
    {
      title: '报警处理时间',
      index: 'alarmProcessTime',
    },
  ]
  // 请求主数据
  getData() {
    const body = this.require.encodeObject({
      page: this.pi,
      rows: this.ps,
    })
    this.require.post(this.url, body).subscribe((res: any) => {
      // console.log(res)
      switch (res.code) {
        case "10005":
          const data = res.data;
          this.pi = data.page;
          this.total = data.records;
          if (res.data && data.list !== null && data.list.length > 0) {
            this.data = data.list.map((e) => {
              return {
                dtuId: e.dtuId,
                regionType: e.regionType,
                uuid: e.uuid,
                desc: e.desc,
                alarmType: e.alarmType,
                alarmStartTime: e.alarmStartTime,
                value: e.value,
                alarmProcess: e.alarmProcess,
                alarmProcessTime: e.alarmProcessTime,
                fileVersion: e.fileVersion,
              }
            })
          } else {
            this.api.message.info('数据为空', { nzDuration: 1000 })
          }
          break;
        default:
          console.log(res)
      }
    }, (err) => {
      console.log(err)
    })
  }
  // 监听变化
  change(ret: STChange) {
    if (ret.type === 'pi' || ret.type === 'ps') {
      this.pi = ret.pi;
      this.ps = ret.ps;
      this.getData();
    }
  }

  ngOnInit() {
    this.getData()
  }

}
