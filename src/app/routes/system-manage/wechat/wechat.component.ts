import { Component, OnInit, } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { STColumn, STPage, STChange, } from '@delon/abc'
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import { RequireService } from '@core/require';

@Component({
  selector: 'app-wechat',
  templateUrl: './wechat.component.html',
  styles: [`
  .img:{
    width:32px;
    height:32px;
  }
  `]
})
export class WechatComponent implements OnInit {
  constructor(
    private http: _HttpClient,
    private modalService: NzModalService,
    private require: RequireService,
    private message: NzMessageService,
    // @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService
  ) {
  }
  data = [] // 保存表格信息
  wxUser: any = {
    avatarUrl: 'https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83eoY0XoKeqiaIeZ7jFue6a1FuZn7OjHkxAo7MCGiaTd1sgBepBwzCCFiciafBrehaKq2fJ8efcyRo30p5Q/132' //默认头像地址
  }; //保存查看对象
  isVisible = false; // 是否显示对话框
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
  // 表格数据
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
          text: '查看',
          click: (e) => {
            this.isVisible = true;
            this.wxUser = e;
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
      title: '昵称',
      index: 'nickName'
    },
    {
      title: '性别',
      index: 'gender',
      type: 'tag',
      tag: {
        2: { text: '女', color: 'red' },
        1: { text: '男', color: 'blue' },
      }
    },
    {
      title: '城市',
      index: 'city'
    },
    {
      title: '省份',
      index: 'province'
    },
    {
      title: '国家',
      index: 'country',
    },
    {
      title: '头像',
      render: 'avatar',
    },
    {
      title: '电话号码',
      index: 'cellphone'
    },

  ];
  //隐藏对话框
  handleCancel() {
    this.isVisible = false;
  }
  // 请求微信列表
  getData() {
    const url = this.require.api.getWxUsers;
    // 请求主体
    const body = this.require.encodeObject({
      page: this.pi,
      rows: this.ps
    })
    // 发送请求
    this.require.post(url, body).subscribe((res: any) => {
      // console.log(res);
      switch (res.code) {
        case "10005":
          const data = res.data;
          this.pi = data.page;
          this.total = data.records;
          if (data.rows.length > 0) {
            // this.message.success('成功!', { nzDuration: 1000 });
            this.data = data.rows.map((e) => {
              return {
                id: e.id,
                nickName: e.nickName,
                gender: e.gender,
                city: e.city,
                province: e.province,
                country: e.country,
                avatarUrl: e.avatarUrl,
                cellphone: e.cellphone
              }
            });
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
