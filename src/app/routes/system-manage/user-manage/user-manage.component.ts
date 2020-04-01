import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { STColumn, STChange, STPage } from '@delon/abc';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { RequireService } from '@core/require';
import { SFComponent, SFSchema } from '@delon/form';

@Component({
  selector: 'app-user-manage',
  templateUrl: './user-manage.component.html',
  styles: [
    `.buttons{
      position:relative;
      left:2rem;
      bottom:0.8rem;
      }
    `
  ]

})
export class UserManageComponent implements OnInit {
  // 构建函数 注入依赖
  constructor(
    private message: NzMessageService,
    public http: _HttpClient,
    private require: RequireService
  ) {
  }
  // 视图view
  @ViewChild('sf', { static: false }) sf: SFComponent
  isVisible = false; // 显示隐藏对话框
  data = [] // 保存表格信息
  pi = 1; // 表格页码
  ps = 10;// 表格每页数量
  total; // 总数据数量
  // 分页配置
  pages: STPage = {
    total: '',
    showSize: true,
    showQuickJumper: true,
    front: false,
    pageSizes: [10, 20, 30, 40, 50],
    placement: 'center'
  }
  // 模板双向绑定数据
  formUserName = '';
  formEmail = '';
  formPhone = '';
  formDisabled = false;
  usernameDisabled = false;
  // 表格绑定数据
  users = [];
  columns: STColumn[] = [
    // {
    //   title: '序号',
    //   index: '',
    //   type: 'checkbox'
    // },
    {
      title: '操作',
      buttons: [
        {
          text: '删除',
          type: 'del',
          click: (e) => {
            const deleteUrl = this.require.api.deleteUser;
            let body;
            if (e.id) {
              body = this.require.encodeObject({
                id: e.id
              })
            }
            this.require.post(deleteUrl, body).subscribe((res: any) => {
              switch (res.code) {
                case '10005':
                  if (this.total % this.ps === 1 && this.pi > 1) this.pi--;
                  this.getData();
                  break;
                default:
                  console.log(res);
                  break;
              }
            }, (err) => { })
          }
        }
      ]
    },
    {
      title: 'ID',
      index: 'id',
      sort: { compare: (a, b) => a.id - b.id }
    },
    {
      title: '用户名',
      index: 'username',
      // sort: { compare: (a, b) => a.username.length - b.username.length }
    },
    {
      title: '邮箱',
      index: 'email'
    },
    {
      title: '电话号码',
      index: 'phone'
    },

  ];
  // 添加管理员表单数据
  ui = {
    spanLabel: 6,
    spanControl: 12
  }
  schema: SFSchema = {
    required: ['username', 'email', 'phone'],
    properties: {
      username: {
        type: 'string',
        title: '用户名'
      },
      email: {
        type: 'string',
        title: '邮箱',
        format: 'email',
        ui: {
          errors: {
            'required': '必填项'
          }
        }
      },
      phone: {
        type: 'string',
        title: '联系号码',
        format: 'mobile'
      },
    }
  };
  // 发送请求用户列表
  getData() {
    // 请求主体
    const url = this.require.api.getUsers;
    const body = this.require.encodeObject({
      page: this.pi,
      rows: this.ps
    })
    this.require.post(url, body).subscribe((res: any) => {
      switch (res.code) {
        case '10005':
          // console.log(res)
          const data = res.data;
          this.pi = data.page;
          this.total = data.records;
          if (data.rows.length > 0) {
            this.data = data.rows.map((e) => {
              return {
                id: e.id,
                username: e.username,
                email: e.email,
                phone: e.phone,
              }
            })
            return;
          } else {
            this.data = [];
            this.message.info('数据为空', { nzDuration: 1000 })
          }
          break;
        default:
          console.log(res);
          break;
      }

    }, (err) => {
      console.log(err);
    })
  }
  // 关闭对话框
  handleCancel() {
    this.isVisible = false;
    setTimeout(() => {
      this.sf.refreshSchema();
    }, 1000)
  }
  // 添加管理员
  addUserApi(value) {
    const addurl = this.require.api.addUser;
    const body = this.require.encodeObject({
      username: value.username,
      email: value.email,
      phone: value.phone
    })
    try {
      this.require.post(addurl, body).subscribe((res: any) => {
        switch (res.code) {
          case '10005':
            this.getData();
            this.handleCancel();
            break;
          default:
            console.log(res);
            break;
        }


      }, (err) => {
      })
    } catch (err) {
    }
    return 200
  }
  // 页面加载时
  ngOnInit() {
    this.getData();
  }
  // 表格监听
  change(ret: STChange) {
    if (ret.type === "pi" || ret.type === 'ps') {
      this.pi = ret.pi;
      this.ps = ret.ps;
      this.getData();
    }
  }
  reload() {
    this.pi = 1;
    this.ps = 10;
    this.getData();
  }
  // 添加用户按钮
  addUser() {
    this.isVisible = true;
  }
  // 刷新表格
  reLoad() {
    this.getData();
  }


}
