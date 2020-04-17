import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { STColumn, STPage, STChange, STColumnTag } from '@delon/abc';
import { RequireService } from '@core/require';
import { SFComponent, SFSchema, SFGridSchema, SFTextWidgetSchema, SFRadioWidgetSchema, SFDateWidgetSchema } from '@delon/form';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
// 表格配置项
const TAG: STColumnTag = {
  0: { text: '否', color: '' },
  1: { text: '是', color: 'blue' },
}
@Component({
  selector: 'app-dtu-default-config',
  templateUrl: './dtu-default-config.component.html',
  styles: []
})
export class DtuDefaultConfigComponent implements OnInit {
  constructor(public http: _HttpClient, private require: RequireService) { }
  data = []; // 保存表格信息
  pi = 1; // 表格页码
  ps = 10;// 表格每页数量
  total; // 总数据数量
  checked = []; // 表格选中
  adminId;
  // 分页配置
  pages: STPage = {
    total: '',
    showSize: true,
    showQuickJumper: true,
    front: false,
    pageSizes: [10, 20, 30, 40, 50],
    placement: 'center'
  }
  isVisible = false; // 是否显示添加/编辑对话框
  @ViewChild('sf', { static: false }) sf: SFComponent;
  // sf表单配置
  // 添加/编辑表单配置项
  ui = {
    spanLabel: 6,
    spanControl: 12,
  }
  schema: SFSchema = {
    required: ['gatewayNumber', 'startTime', 'endTime', 'alarmPush', 'scanPolicy'],
    properties: {
      id: {
        type: 'string',
        default: '',
        ui: {
          hidden: true,
        }
      },
      gatewayNumber: {
        type: 'string',
        title: 'DTU编号',
        default: '',
      },
      startTime: {
        type: 'string',
        title: '开始时间',
        // tslint:disable-next-line: no-object-literal-type-assertion
        ui: {
          widget: 'date',
          showTime: true,
          placeholder: '选择时间',
        } as SFDateWidgetSchema,
        default: '',
      },
      endTime: {
        type: 'string',
        title: '停止时间',
        ui: {
          widget: 'date',
          placeholder: '选择时间',
          showTime: true,
        },
        default: '',
      },
      alarmPush: {
        type: 'string',
        title: '推送报警',
        ui: {
          widget: 'radio',
          asyncData: () => of([{ label: '无', value: 0 }, { label: '启用', value: 1 }]).pipe(delay(100)),
        },
        default: 0,
      },
      scanPolicy: {
        type: 'string',
        title: '扫码策略',
        ui: {
          widget: 'radio',
          asyncData: () => of([{ label: '无', value: 0 }, { label: '扫码关注', value: 1 }]).pipe(delay(100)),
        },
        default: 0,
      },
    },


  }
  // st表格配置
  columns: STColumn[] = [
    {
      title: '',
      type: 'checkbox',
      width: 50,
    },
    {
      title: '操作',
      width: 100,
      buttons: [
        {
          text: '编辑',
          click: (e) => {
            const startTime = e.startTime;
            const endTime = e.endTime;
            this.isVisible = true;
            this.schema.properties.id.default = e.id;
            this.schema.properties.gatewayNumber.default = e.gatewayNumber;
            if (startTime !== 'Invalid date' && endTime !== 'Invalid date') {
              this.schema.properties.startTime.default = e.startTime;
              this.schema.properties.endTime.default = e.endTime;
            } else {
              this.schema.properties.startTime.default = null;
              this.schema.properties.endTime.default = null;
            }
            this.schema.properties.alarmPush.default = e.alarmPush;
            this.schema.properties.scanPolicy.default = e.scanPolicy;
            this.sf.refreshSchema();
          }
        },
      ],
    },
    {
      title: '序号',
      index: 'id',
      width: 100,
      sort: { compare: (a, b) => a.id - b.id },
    },
    {
      title: 'DTU编号',
      index: 'gatewayNumber',
      width: 400,
      className: 'text-nowrap,text-truncate'
    },
    {
      title: '默认配置',
      width: 150,
      index: 'registerContent',
      render: 'registerContent'
    },
    {
      title: '所属管理员',
      index: 'userName',
      width: 150,
    },
    {
      title: '分配管理员',
      index: 'handlerName',
      width: 150,
    },
    {
      title: '启用时间',
      index: 'startTime',
      width: 200,
    },
    {
      title: '终止时间',
      index: 'endTime',
      width: 200,
    },
    {
      title: '注册',
      index: 'register',
      width: 100,
      type: 'tag',
      tag: TAG
    },
    {
      title: '报警推送',
      index: 'alarmPush',
      width: 100,
      type: 'tag',
      tag: TAG
    },
    {
      title: '扫码策略',
      index: 'scanPolicy',
      width: 100,
      type: 'tag',
      tag: TAG
    },


  ];
  // 关闭对话框
  handleCancel() {
    this.isVisible = false;
  }
  // 监听表格变化
  change(ret: STChange) {
    if (ret.type === 'pi' || ret.type === 'ps') {
      this.pi = ret.pi;
      this.ps = ret.ps;
      this.getData();
    }
  }
  // 请求表格数据
  getData() {
    const url = this.require.api.getAdminDtus;
    const body = this.require.encodeObject({
      adminId: this.adminId,
      page: this.pi,
      rows: this.ps,
    });
    this.require.post(url, body).subscribe((res: any) => {
      // console.log(res)
      switch (res.code) {
        case "10005":
          const data = res.data;
          this.pi = data.page;
          this.total = data.records;
          if (data.rows.length > 0) {
            this.data = data.rows.map((e) => {
              return {
                id: e.id,
                userId: e.userId,
                userName: e.userName,
                gatewayNumber: e.gatewayNumber,
                handlerId: e.handlerId,
                handlerName: e.handlerName,
                createTime: e.createTime,
                startTime: e.startTime,
                endTime: e.endTime,
                register: e.register,
                alarmPush: e.alarmPush,
                registerContent: e.registerContent,
                scanPolicy: e.scanPolicy,
              }
            });
          } else {
            this.data = [];
            this.require.message.info('数据为空', { nzDuration: 1000 })
          }

          break;
        default:
          console.log(res)
          break;
      }

    }, (err) => {

    })
  }

  // 提交修改
  editDataApi(value) {
    const url = this.require.api.editAdminDtu;
    const startTime = value.startTime;
    const endTime = value.endTime;
    const start = Date.parse(value.startTime);
    const end = Date.parse(value.endTime);
    const day = (end - start) / (1000 * 60 * 60 * 24);
    if (day < 0) return this.require.message.error('结束时间须在开始时间之后!')
    const body = this.require.encodeObject({
      gatewayNumber: value.gatewayNumber,
      id: value.id,
      startTime,
      endTime,
      alarmPush: value.alarmPush,
      scanPolicy: value.scanPolicy,
    })
    this.require.post(url, body).subscribe((res: any) => {
      switch (res.code) {
        case '10005':
          this.handleCancel();
          this.getData();
          break;
        default:
          break;
      }
    })
  }

  ngOnInit() {
    this.adminId = this.require.settingsService.user.id;
    this.getData();
  }

}
