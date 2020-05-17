import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, SettingsService } from '@delon/theme';
import { RequireService } from '@core/require';
import { NzFormatEmitEvent, NzTreeNodeOptions } from 'ng-zorro-antd/core';
import { STColumn, STPage, STChange, STColumnTag } from '@delon/abc';
import { SFSchema, SFComponent, SFRadioWidgetSchema, SFGridSchema, SFDateWidgetSchema } from '@delon/form';
import { NzMessageService, UploadFile } from 'ng-zorro-antd';
import { delay } from 'rxjs/operators';
import { of } from 'rxjs';
import { ApiService } from '@core/api.service';
import { HttpHeaders } from '@angular/common/http';

// 表格配置项
const TAG: STColumnTag = {
  0: { text: '否', color: '' },
  1: { text: '是', color: 'blue' },
};
@Component({
  selector: 'app-dtu-distribution',
  templateUrl: './dtu-distribution.component.html',
  styles: [
    `
      .buttons {
        position: relative;
        left: 2rem;
        bottom: 0.8rem;
      }
      .sf {
        padding-left: 40px;
      }
    `,
  ],
})
export class DtuDistributionComponent implements OnInit {
  // 构建类
  constructor(
    public http: _HttpClient,
    private message: NzMessageService,
    private require: RequireService,
    private settingService: SettingsService,
    private api: ApiService,
  ) {}
  data = []; // 保存表格信息
  deleteUrl = this.require.api.deleteAdminDtu;
  nodes: NzTreeNodeOptions[] = []; // 节点数据
  nodes1: NzTreeNodeOptions[] = []; // 分配管理员节点
  pi = 1; // 表格页码
  ps = 10; // 表格每页数量
  total; // 总数据数量
  checked = []; // 表格选中
  adminId = this.settingService.user.id; // 当前选中节点id
  // 分页配置
  pages: STPage = {
    total: '',
    showSize: true,
    showQuickJumper: true,
    front: false,
    pageSizes: [10, 20, 30, 40, 50],
    placement: 'center',
  };
  // 表格数据
  columns: STColumn[] = [
    {
      type: 'checkbox',
    },
    {
      title: '操作',
      width: 100,
      buttons: [
        {
          text: '操作',
          children: [
            {
              text: '编辑',
              click: e => {
                this.formHeader = '编辑记录';
                this.isVisible = true;
                this.addOrEdit = false;
                this.schema.properties.id.default = e.id;
                this.schema.properties.gatewayNumber.default = e.gatewayNumber;
                const startTime = e.startTime;
                const endTime = e.endTime;
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
              },
            },
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
                        this.getData();
                        break;
                      default:
                        console.log(res);
                        break;
                    }
                  },
                  err => {},
                );
              },
            },
          ],
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
      width: 160,
      // className: 'text-nowrap,text-truncate'
    },
    {
      title: '管理人员',
      index: 'userName',
      width: 120,
    },
    {
      title: '操作人员',
      index: 'handlerName',
      width: 120,
    },
    {
      title: '创建时间',
      index: 'createTime',
      width: 250,
    },
    {
      title: '启用开始时间',
      index: 'startTime',
      width: 250,
    },
    {
      title: '启用结束时间',
      index: 'endTime',
      width: 250,
    },
    {
      title: '注册',
      index: 'register',
      type: 'tag',
      tag: TAG,
      width: 100,
    },
    {
      title: '报警',
      index: 'alarmPush',
      type: 'tag',
      tag: TAG,
      width: 100,
    },
    {
      title: '扫码策略',
      index: 'scanPolicy',
      type: 'tag',
      tag: TAG,
      width: 150,
    },
  ];
  formHeader; // 添加/编辑对话框标题
  isVisible = false; // 是否显示添加/编辑对话框
  isVisible2 = false; // 是否显示上传对话框
  isVisible3 = false; // 是否显示分配dtu对话框
  // 添加/编辑按钮切换显示
  addOrEdit = true; // true=添加 false=修改
  // 表单配置项
  @ViewChild('sf', { static: false }) sf: SFComponent;
  @ViewChild('sf2', { static: false }) sf2: SFComponent;
  @ViewChild('sf3', { static: false }) sf3: SFComponent;
  ui = {
    spanLabel: 6,
    spanControl: 12,
  };
  // 添加/编辑表单配置项
  schema: SFSchema = {
    required: ['gatewayNumber', 'userName', 'startTime', 'endTime', 'alarmPush', 'scanPolicy'],
    properties: {
      id: {
        type: 'string',
        default: '',
        ui: {
          hidden: true,
        },
      },
      userName: {
        type: 'string',
        title: '所属管理员',
        default: this.settingService.user.username,
        readOnly: true,
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
          placeholder: '选择时间',
          showTime: true,
        } as SFDateWidgetSchema,
      },
      endTime: {
        type: 'string',
        title: '结束时间',
        ui: {
          widget: 'date',
          placeholder: '选择时间',
          showTime: true,
        },
      },
      alarmPush: {
        type: 'string',
        title: '推送报警',
        ui: {
          widget: 'radio',
          asyncData: () =>
            of([
              { label: '无', value: 0 },
              { label: '启用', value: 1 },
            ]).pipe(delay(100)),
        },
        default: 0,
      },
      scanPolicy: {
        type: 'string',
        title: '扫码策略',
        // tslint:disable-next-line: no-object-literal-type-assertion
        ui: {
          widget: 'radio',
          asyncData: () =>
            of([
              { label: '无', value: 0 },
              { label: '扫码关注', value: 1 },
            ]).pipe(delay(100)),
        } as SFRadioWidgetSchema | SFGridSchema,
        default: 0,
      },
    },
  };
  // 手动上传配置
  fileList: UploadFile[] = [];
  beforeUpload = (file: UploadFile): boolean => {
    // console.log(file)
    this.fileList = [];
    this.fileList = this.fileList.concat(file);
    return false;
  };
  // 上传表单配置项
  // tslint:disable-next-line: member-ordering
  schema2: SFSchema = {
    required: ['userName'],
    properties: {
      userName: {
        type: 'string',
        title: '添加dtu到',
        default: '',
        readOnly: true,
      },
    },
  };
  // 分配DTU
  // tslint:disable-next-line: member-ordering
  schema3: SFSchema = {
    required: ['mode', 'userId'],
    properties: {
      mode: {
        type: 'string',
        title: '分配',
        // tslint:disable-next-line: no-object-literal-type-assertion
        ui: {
          widget: 'radio',
          asyncData: () =>
            of([
              { label: '所选DTU', value: '1' },
              { label: '全部DTU', value: '2' },
            ]).pipe(delay(100)),
          // change: (e) => console.log(e),
        } as SFRadioWidgetSchema,
        default: '1',
      },
      userId: {
        type: 'string',
        title: '分配到管理员',
        enum: [],
        ui: {
          widget: 'tree-select',
          defaultExpandAll: true,
        },
        default: '',
      },
    },
  };
  // 递归修改节点名称
  edit(obj) {
    obj.title = obj.name;
    obj.key = obj.id;
    if (obj.additionalParameters) {
      Object.keys(obj).forEach(key => {
        const arr = [];
        obj.selected = obj.additionalParameters.itemSelected;
        // tslint:disable-next-line: forin
        for (const i in obj.additionalParameters.children) {
          arr.push(obj.additionalParameters.children[i]);
          this.edit(obj.additionalParameters.children[i]);
        }
        obj.children = arr;
      });
    } else {
      obj.isLeaf = true;
    }
    return obj;
  }
  // 请求管理员名下DTU节点
  getNode() {
    const url = this.require.api.loadAdminTreeData;
    this.require.post(url).subscribe(
      (res: any) => {
        const data = res.data.adminTreeData;
        let obj;
        // tslint:disable-next-line: forin
        for (const i in data) {
          obj = data[i];
        }
        this.nodes = [this.edit(obj)];
        // 设置管理员id 和 默认userName
        this.getData();
      },
      err => {},
    );
  }
  // 节点点击
  nzEvent(event: NzFormatEmitEvent): void {
    this.pi = 1;
    this.ps = 10;
    this.adminId = event.node.key;
    this.schema.properties.userName.default = event.node.origin.title;
    this.schema2.properties.userName.default = event.node.origin.title;
    this.sf.refreshSchema();
    this.sf2.refreshSchema();
    this.getData();
  }
  // 请求数据
  getData() {
    const url = this.require.api.getAdminDtus;
    const body = this.require.encodeObject({
      adminId: this.adminId,
      page: this.pi,
      rows: this.ps,
    });
    this.require.post(url, body).subscribe(
      (res: any) => {
        switch (res.code) {
          case '10005':
            // console.log(res)
            const data = res.data;
            this.pi = data.page;
            this.total = data.records;
            if (data.rows.length > 0) {
              this.data = data.rows.map(e => {
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
                };
              });
            } else {
              this.data = [];
              this.require.message.info('数据为空', { nzDuration: 1000 });
            }
            break;
          default:
            console.log(res);
            break;
        }
      },
      err => {},
    );
  }
  // st表格监听
  change(ret: STChange) {
    // console.log(ret);
    if (ret.type === 'checkbox') {
      this.checked = ret.checkbox.map(e => e.id);
    }
    if (ret.type === 'pi' || ret.type === 'ps') {
      this.pi = ret.pi;
      this.ps = ret.ps;
      this.getData();
    }
  }
  // 关闭表单
  handleCancel(num) {
    switch (num) {
      case 1:
        this.isVisible = false;
        setTimeout(() => {
          this.schema.properties.gatewayNumber.default = '';
          this.schema.properties.startTime.default = null;
          this.schema.properties.endTime.default = null;
          this.schema.properties.alarmPush.default = 0;
          this.schema.properties.scanPolicy.default = 0;
          this.sf.refreshSchema();
        }, 500);
        break;
      case 2: // 关闭上传excel
        this.isVisible2 = false;
        this.fileList = [];
        break;
      case 3: // 关闭分配
        this.isVisible3 = false;
        break;
    }
  }
  // 表单添加/编辑请求
  handleData(value, mode) {
    let url;
    let body;
    const startTime = value.startTime;
    const endTime = value.endTime;
    const start = Date.parse(value.startTime);
    const end = Date.parse(value.endTime);
    const day = (end - start) / (1000 * 60 * 60 * 24);
    if (day < 0) return this.require.message.error('结束时间须在开始时间之后!');
    switch (mode) {
      case 'edit':
        url = this.require.api.editAdminDtu; // 编辑url
        body = this.require.encodeObject({
          gatewayNumber: value.gatewayNumber,
          id: value.id,
          startTime,
          endTime,
          alarmPush: value.alarmPush,
          scanPolicy: value.scanPolicy,
        });
        break;
      case 'add':
        url = this.require.api.addAdminDtu; // 添加url
        body = this.require.encodeObject({
          gatewayNumber: value.gatewayNumber,
          userName: value.userName,
          startTime,
          endTime,
          alarmPush: value.alarmPush,
          scanPolicy: value.scanPolicy,
        });
    }
    // 发送添加/编辑请求
    this.require.post(url, body).subscribe(
      (res: any) => {
        switch (res.code) {
          case '10005':
            this.handleCancel(1);
            this.getData();
            break;
          default:
            console.log(res);
        }
      },
      err => {
        this.message.error('操作失败');
      },
    );
  }
  // 导入excel请求
  upload(value) {
    const formData = new FormData();
    this.fileList.forEach((file: any) => {
      formData.append('file', file);
    });
    formData.append('upload_userid', value.userName);
    const url = this.require.api.uploadDtuExcel;
    formData.append('token', this.require.tokenService.get().token);
    const header: HttpHeaders = new HttpHeaders();
    header.set('Content-Type', 'multipart/form-data');

    this.http.post(url, formData, null, { headers: header }).subscribe(
      (res: any) => {
        switch (res.code) {
          case '10005':
            this.getData();
            this.handleCancel(2);
            break;
          default:
            console.log(res);
            this.fileList = [];
            break;
        }
      },
      err => {
        console.log(err);
      },
    );
  }

  // 递归删除多余的节点
  deleteNodes(obj) {
    delete obj.name;
    delete obj.id;
    delete obj.type;
    delete obj.pid;
    if (obj.additionalParameters) {
      Object.keys(obj).forEach(key => {
        delete obj.additionalParameters;
        // tslint:disable-next-line: forin
        for (const i in obj.children) {
          this.deleteNodes(obj.children[i]);
        }
      });
    } else {
      delete obj.additionalParameters;
    }
    return obj;
  }
  // 分配DTU请求
  distribute(value) {
    const url = this.require.api.distributeDtus;
    let body = this.require.encodeArray(this.checked, 'ids');
    body +=
      '&' +
      this.require.encodeObject({
        mode: value.mode,
        userId: value.userId,
        oldUserId: this.adminId,
      });
    this.require.post(url, body).subscribe(res => {
      // console.log(res);
      this.handleCancel(3);
      this.getData();
    });
  }

  // 删除多选记录按钮
  deleteButton() {
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
                  this.getData();
                  this.checked = [];
                  break;
                default:
                  console.log(res);
                  break;
              }
            },
            err => {},
          );
        },
      });
    } else {
      this.api.message.info('未选中记录!');
      return 0;
    }
  }
  // 分配DTU按钮
  distributeButton() {
    if (this.checked.length === 0) {
      return this.api.message.info('未选中DTU!');
    }
    // console.log(this.checked)
    this.nodes1 = [this.deleteNodes(this.nodes[0])];
    this.isVisible3 = true;
    this.schema3.properties.userId.enum = this.nodes1;
    this.schema3.properties.userId.default = this.adminId;
    this.sf3.refreshSchema();
  }

  ngOnInit() {
    // const user = this.settingService.user;
    // this.schema.properties.userName.default = user.name;
    // this.schema2.properties.userName.default = user.name;
    // this.sf.refreshSchema();
    // this.sf2.refreshSchema();
    this.getNode();
  }
}
