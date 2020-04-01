import { Component, OnInit } from '@angular/core';
import { RequireService } from '@core/require';
import { STColumn, STPage, STChange } from '@delon/abc';
import { _HttpClient } from '@delon/theme';
@Component({
  selector: 'app-equip-default-config',
  templateUrl: './equip-default-config.component.html',
  styles: []
})
export class EquipDefaultConfigComponent implements OnInit {
  constructor(private require: RequireService, public http: _HttpClient, ) { }
  data = [] // 保存表格信息
  pi = 1; // 表格页码
  ps = 10;// 表格每页数量
  total; // 总数据数量

  pages: STPage = { // 分页配置
    total: '',
    showSize: true,
    showQuickJumper: true,
    front: false,
    pageSizes: [10, 20, 30, 40, 50],
    placement: 'center'
  }
  // 表格项
  columns: STColumn[] = [
    {
      title: '',
      type: 'checkbox',
    },
    {
      title: 'ID',
      index: 'id',
      width: 100,
      className: 'text-nowrap,text-truncate',
      sort: { compare: (a, b) => a.id - b.id }
    },
    {
      title: '设备编号',
      index: 'equipId',
      width: 300,
      className: 'text-nowrap,text-truncate',
    },
    {
      title: '用户名',
      index: 'username',
      width: 100,
    },
    {
      title: '公司',
      index: 'company',
      width: 200,
    },
    {
      title: '设备类型',
      index: 'equipType',
      width: 100,
    },
    // {
    //   title: '二维码内容',
    //   index: 'content',
    //   className: 'text-nowrap,text-truncate'
    // },
    // {
    //   title: '操作',
    //   width: 200,
    //   buttons: [
    //     {
    //       text: '编辑'
    //     },
    //   ],
    // }
  ]
  getData() {
    const url = this.require.api.getEquipQRs;
    const body = this.require.encodeObject({
      page: this.pi,
      rows: this.ps,
    });
    this.require.post(url, body).subscribe((res: any) => {
      switch (res.code) {
        case "10005":
          const data = res.data;
          this.pi = data.page;
          this.total = data.records;
          this.data = data.rows.map((e) => {
            return {
              id: e.id,
              equipId: e.equipId,
              userId: e.userId,
              username: e.username,
              company: e.company,
              equipType: e.equipType,
              content: e.content,
            }
          })
          break;
        default:
          console.log(res)
          break;
      }

    }, (err) => {

    })
  }
  // 监听表格变化
  change(ret: STChange) {
    if (ret.type === "pi" || ret.type === 'ps') {
      this.pi = ret.pi;
      this.ps = ret.ps;
      this.getData();
    }
  }
  ngOnInit() {
    this.getData();
  }

}
