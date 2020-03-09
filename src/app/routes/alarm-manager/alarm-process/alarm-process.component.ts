import { Component, OnInit, Inject } from '@angular/core';
import { ITokenService, DA_SERVICE_TOKEN } from '@delon/auth';
import { STColumn, STPage, STChange } from '@delon/abc';
import { _HttpClient } from '@delon/theme';
import { RequireService } from '@core/require';
import { ApiService } from '@core/api.service';

@Component({
  selector: 'app-alarm-process',
  templateUrl: './alarm-process.component.html',
  styles: []
})
export class AlarmProcessComponent implements OnInit {
  constructor(
    private http: _HttpClient,
    private require: RequireService,
    private api: ApiService
  ) { }
  url = this.require.api.getAllAlarm;
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
  columns: STColumn[] = [
    {
      title: 'checkbox',
      index: 'uuid',
      type: 'checkbox',

    },
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
  // 监听变化
  change(ret: STChange) {
    if (ret.type === 'pi' || ret.type === 'ps') {
      this.pi = ret.pi;
      this.ps = ret.ps;
      this.getData();
    } else if (ret.type === 'checkbox') {
      this.checked = ret.checkbox.map(e => e.id)
      // console.log(this.checked2)
    }
  }
  //请求主数据
  getData() {
    this.require.post(this.url).subscribe((res: any) => {
      switch (res.code) {
        case "10005":
          const data = res.data;
          this.pi = data.page;
          this.total = data.records;
          if (data.list !== null && data.list.length > 0) {
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
  ngOnInit() {
    this.getData()
  }

}
