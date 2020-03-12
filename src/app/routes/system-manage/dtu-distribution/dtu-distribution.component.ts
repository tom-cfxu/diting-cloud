import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { RequireService } from '@core/require';
import { NzFormatEmitEvent, NzTreeNodeOptions } from 'ng-zorro-antd/core';
import { STColumn, STPage, STChange, STColumnTag } from '@delon/abc';
import { SFSchema, SFComponent, SFRadioWidgetSchema, SFTextWidgetSchema, SFGridSchema, SFUploadWidgetSchema } from '@delon/form'
import { NzMessageService } from 'ng-zorro-antd';
import { delay } from 'rxjs/operators';
import { of } from 'rxjs';
import { ApiService } from '@core/api.service';
import * as moment from 'moment'

// 表格配置项
const TAG: STColumnTag = {
  0: { text: '否', color: '' },
  1: { text: '是', color: 'blue' },
}
@Component({
  selector: 'app-dtu-distribution',
  templateUrl: './dtu-distribution.component.html',
  styles: [
    `.buttons{
      position:relative;
      left:2rem;
      bottom:0.8rem;
      }
    .sf{
      padding-left:40px;
    }
    `
  ]
})
export class DtuDistributionComponent implements OnInit {
  // 构建类
  constructor(private http: _HttpClient,
    private message: NzMessageService,
    private require: RequireService,
    private api: ApiService) { }
  data = []; // 保存表格信息
  deleteUrl = this.require.api.deleteAdminDtu;
  nodes: NzTreeNodeOptions[] = [];// 节点数据
  nodes1: NzTreeNodeOptions[] = [];// 分配管理员节点
  pi = 1; // 表格页码
  ps = 10;// 表格每页数量
  total; // 总数据数量
  checked = []; // 表格选中
  adminId = null;// 当前选中节点id 
  // 分页配置
  pages: STPage = {
    total: '',
    showSize: true,
    showQuickJumper: true,
    front: false,
    pageSizes: [10, 20, 30, 40, 50],
    placement: 'center'
  }
  // 表格数据
  columns: STColumn[] = [
    {
      type: 'checkbox',
      width: 50
    },
    {
      title: '序号',
      index: 'id',
      width: 50,
      sort: { compare: (a, b) => a.id - b.id }
    },
    {
      title: 'DTU编号',
      index: 'gatewayNumber',
      width: 450,
      // className: 'text-nowrap,text-truncate'
    },
    {
      title: '管理人员',
      index: 'userName',
      width: 150,
    },
    {
      title: '操作人员',
      index: 'handlerName',
      width: 150,
    },
    {
      title: '创建时间',
      index: 'createTime',
      width: 200,
    },
    {
      title: '启用开始时间',
      index: 'startTime',
      width: 200
    },
    {
      title: '启用结束时间',
      index: 'endTime',
      width: 200
    },
    {
      title: '注册',
      index: 'register',
      type: 'tag',
      tag: TAG,
      width: 100
    },
    {
      title: '报警',
      index: 'alarmPush',
      type: 'tag',
      tag: TAG,
      width: 100
    },
    {
      title: '扫码策略',
      index: 'scanPolicy',
      type: 'tag',
      tag: TAG,
      width: 100,
    },
    // {
    //   title: '默认注册内容',
    //   index: 'registerContent',
    // },
    {
      title: '操作',
      width: 100,
      buttons: [
        {
          text: '编辑',
          click: (e) => {
            this.formHeader = '编辑记录';
            this.isVisible = true;
            this.addOrEdit = false;
            this.schema.properties.id.default = e.id;
            this.schema.properties.gatewayNumber.default = e.gatewayNumber;
            const startTime = moment(e.startTime).format();
            const endTime = moment(e.endTime).format();
            if (startTime !== 'Invalid date' && endTime !== 'Invalid date') {
              this.schema.properties.startTime.default = moment(e.startTime).format();
              this.schema.properties.endTime.default = moment(e.endTime).format();
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
          },
        },
      ]
    }
  ]
  formHeader;
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
  }
  // 添加/编辑表单配置项
  schema: SFSchema = {
    required: ['gatewayNumber', 'userName', 'startTime', 'endTime', 'alarmPush', 'scanPolicy'],
    properties: {
      id: {
        type: 'string',
        default: '',
        ui: {
          hidden: true,
        }
      },
      userName: {
        type: 'string',
        title: '所属管理员',
        default: '',
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
        format: 'date-time',
        default: null,
      },
      endTime: {
        type: 'string',
        title: '停止时间',
        format: 'date-time',
        default: null,
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
        } as SFRadioWidgetSchema | SFGridSchema,
        default: 0,
      },
    },


  }
  // 上传表单配置项
  schema2: SFSchema = {
    properties: {
      upload: {
        type: 'string',
        title: '添加文件',
        ui: {
          widget: 'upload',
          action: '/upload',
          resReName: 'resource_id',
          urlReName: 'url',
          type: 'drag',
          hint: ' ',
        } as SFUploadWidgetSchema,
      },
      userName: {
        type: 'string',
        title: '添加dtu到',
        ui: {
          spanControl: 12,
        } as SFGridSchema,
        default: '',
        readOnly: true
      }
    }
  }
  // 分配DTU
  schema3: SFSchema = {
    properties: {

    }
  }

  // 递归修改节点名称
  edit(obj) {
    obj.title = obj.name;
    obj.key = obj.id;
    if (obj.additionalParameters) {
      Object.keys(obj).forEach((key) => {
        const arr = [];
        obj.selected = obj.additionalParameters.itemSelected;
        for (const i in obj.additionalParameters.children) {
          arr.push(obj.additionalParameters.children[i])
          this.edit(obj.additionalParameters.children[i]);
        }
        obj.children = arr;

      })
    } else {
      obj.isLeaf = true;
    }
    return obj;
  }
  // 获取父子节点
  getNode() {
    const url = this.require.api.loadAdminTreeData;
    this.require.post(url).subscribe((res: any) => {
      const data = res.data.adminTreeData;

      let obj;
      for (const i in data) {
        obj = data[i];
      }
      this.nodes = [this.edit(obj)];
      // 设置管理员id 和 默认userName
      this.adminId = this.adminId === null ? this.nodes[0].id : this.adminId;
      this.schema.properties.userName.default = this.schema.properties.userName.default === '' ? this.nodes[0].title : this.schema.properties.userName.default;
      this.schema2.properties.userName.default = this.schema2.properties.userName.default === '' ? this.nodes[0].title : this.schema2.properties.userName.default;
      this.sf.refreshSchema();
      this.sf2.refreshSchema();
      this.getData();
    }, (err) => {

    })
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
    this.getData()
  }
  // 请求数据
  getData() {
    const url = this.require.api.getAdminDtus;
    const body = this.require.encodeObject({
      adminId: this.adminId,
      page: this.pi,
      rows: this.ps
    })
    this.require.post(url, body).subscribe((res: any) => {
      switch (res.code) {
        case '10005':
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
            })
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
  // st表格监听
  change(ret: STChange) {
    if (ret.type === "checkbox") {
      this.checked = ret.checkbox.map(e => e.id)
    }
    if (ret.type === "pi" || ret.type === 'ps') {
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
        }, 500)
        break;
      case 2:
        this.isVisible2 = false;
        break;
      case 3:
        this.isVisible3 = false;
        break;
    }

  }
  // 表单添加/编辑请求
  handleData(value, mode) {
    let url;
    let body;
    const startTime = moment(value.startTime).format('YYYY-MM-DD HH:mm:ss')
    const endTime = moment(value.endTime).format('YYYY-MM-DD HH:mm:ss')
    switch (mode) {
      case 'edit':
        url = this.require.api.editAdminDtu;//编辑url
        body = this.require.encodeObject({
          gatewayNumber: value.gatewayNumber,
          id: value.id,
          startTime,
          endTime,
          alarmPush: value.alarmPush,
          scanPolicy: value.scanPolicy,
        })
        break;
      case 'add':
        url = this.require.api.addAdminDtu;//添加url
        body = this.require.encodeObject({
          gatewayNumber: value.gatewayNumber,
          userName: value.userName,
          startTime,
          endTime,
          alarmPush: value.alarmPush,
          scanPolicy: value.scanPolicy,
        })
    }
    // 发送添加/编辑请求
    this.require.post(url, body).subscribe((res: any) => {
      switch (res.code) {
        case '10005':
          this.handleCancel(1);
          this.getData();
          break;
        default:
          console.log(res)
      }
    }, (err) => {
      this.message.error('操作失败')
    })

  }
  // 导入excel请求
  upload(value) {
    console.log(value)
  }
  // 分配DTU管理员监听
  onChang(event) {
    // this.form.id = event;
  }
  // 递归删除多余的节点
  deleteNodes(obj) {
    delete obj.name;
    delete obj.id;
    delete obj.type;
    delete obj.pid;
    if (obj.additionalParameters) {
      Object.keys(obj).forEach((key) => {
        delete obj.additionalParameters;
        for (const i in obj.children) {
          this.deleteNodes(obj.children[i]);
        }
      })
    } else {
      delete obj.additionalParameters;
    }
    return obj;
  }
  // 分配DTU请求
  distribute() {
    // console.log(this.form)
  }

  // 删除记录按钮
  deleteButton() {
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
  // 分配DTU按钮
  distributeButton() {
    this.nodes1 = [this.deleteNodes(this.nodes[0])];
    this.isVisible3 = true;
    // console.log(this.checked)
  }

  ngOnInit() {
    this.getNode();
  }

}
