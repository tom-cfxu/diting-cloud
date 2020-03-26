import { Component, OnInit } from '@angular/core';
import { STColumn, STChange, STPage, XlsxService, } from '@delon/abc';
import { _HttpClient } from '@delon/theme';
import { RequireService } from '@core/require';
import { ApiService } from '@core/api.service';
import { SFSchema, SFUploadWidgetSchema, SFGridSchema } from '@delon/form';
@Component({
  selector: 'app-bin-manager',
  templateUrl: './bin-manager.component.html',
  styles: []
})
export class BinManagerComponent implements OnInit {
  // 构造函数
  constructor(private http: _HttpClient, private xlsx: XlsxService, private require: RequireService, private api: ApiService) { }
  // 文件列表数据
  deleteUrl = this.require.api.binDelete;// 删除bin文件接口
  data = [] // 保存表格信息
  pi = 1; // 表格页码
  ps = 10;// 表格每页数量
  total; // 总数据数量
  isVisible = false; //上传文件弹出框的显示 
  checked = [];// 选择1
  // 分页配置
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
      type: 'checkbox',
      width: 100,
    },
    {
      title: '操作',
      width: 100,
      buttons: [
        {
          text: '下载',
          type: 'link',
          click: (e) => { this.download(e.id) }
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
                  if (this.total % this.ps == 1 && this.pi > 1) this.pi--;
                  this.getData();
                  break;
                default:
                  console.log(res);
                  break;
              }
            }, (err) => {

            })
          }
        }
      ]
    },

    {
      title: 'ID',
      index: 'id',
      width: 100,
      sort: {
        compare: (a, b) => a.id - b.id,
      },
    },
    {
      title: '现文件名',
      index: 'nfilename',
      width: 300,
      className: 'text-nowrap,text-truncate'
    },
    {
      title: '原文件名',
      index: 'ofilename',
      width: 300,
      className: 'text-nowrap,text-truncate'
    },
    {
      title: '创建时间',
      index: 'createTime',
      width: 200,
    },
    {
      title: '创建人员',
      index: 'createUser',
      width: 75,
    },
    {
      title: '拥有',
      index: 'owner',
      width: 75,
    },
    {
      title: '描述',
      index: 'description',
      width: 50,
    },
    {
      title: '协议版本',
      index: 'protocolVersion',
      width: 50,
    },
    {
      title: '驱动版本',
      index: 'driverVersion',
      width: 50,
    },
    {
      title: '文件版本',
      index: 'fileVersion',
      width: 50,
    },

  ];
  // 上传文件配置
  schema: SFSchema = {
    properties: {
      file: {
        type: 'string',
        title: '添加文件',
        ui: {
          widget: 'upload',
          action: '/upload',
          resReName: 'resource_id',
          urlReName: 'url',
          type: 'drag',
          hint: ' ',
          spanControl: 12,
        } as SFUploadWidgetSchema,
      },
      driverVersion: {
        type: 'string',
        title: '驱动版本',
        ui: {
          widget: 'number',
          // spanControl: 12,
        } as SFGridSchema,
        default: '',
      },
      protocolVersion: {
        type: 'string',
        title: '协议版本',
        ui: {
          widget: 'number',
          // spanControl: 12,
        } as SFGridSchema,
        default: '',
      },
      upLoadType: {
        type: 'string',
        title: '上传类型',
        enum: ['共有', '私有'],
        ui: {
          widget: 'radio'
        },
        default: '共有'
      }
    }
  }
  // 监听变化
  change(ret: STChange) {
    if (ret.type === 'pi' || ret.type === 'ps') {
      this.pi = ret.pi;
      this.ps = ret.ps;
      this.getData();
    } else if (ret.type === 'checkbox') {
      this.checked = ret.checkbox.map(e => e.id)
    }
  }
  // 删除文件列表
  deletueButton() {
    if (this.checked.length > 0) {
      this.api.modalService.confirm({
        nzTitle: '删除提示',
        nzContent: '确定删除所选的记录吗?',
        nzOnOk: () => {
          const body = this.require.encodeArray(this.checked, 'ids');
          this.require.post(this.deleteUrl, body).subscribe((res: any) => {
            switch (res.code) {
              case '10005':
                if (this.total % this.ps == 1 && this.pi > 1) this.pi--;
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
  // 获取文件列表数据请求
  getData() {
    const url = this.require.api.getBins;
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
          if (data.rows.length > 0) {
            this.data = data.rows.map((e) => {
              return {
                id: e.id,
                nfilename: e.nfilename,
                ofilename: e.ofilename,
                createTime: e.createTime,
                createUser: e.createUser,
                description: e.description,
                owner: e.owner,
                protocolVersion: e.protocolVersion,
                driverVersion: e.driverVersion,
                fileVersion: e.fileVersion,
              }
            })
          } else {
            this.data = [];
            this.api.message.info('数据为空', { nzDuration: 1000 })
          }
          break;
        default:
          console.log(res)
      }
    }, (err) => {

    })
  }
  // 上传bin文件
  upload() {
    this.isVisible = true;
  }
  handleCancel() {
    this.isVisible = false;
  }
  // 下载文件请求
  download(id) {
    const url = this.require.api.downloadFile;
    const body = this.require.encodeObject({
      id
    });
    this.require.post(url, body).subscribe((res: any) => {
      switch (res.code) {
        case '10005':
          break;
        default:
          console.log(res)
      }
    }, (err) => {

    })
  }

  ngOnInit() {
    this.getData()
  }

}
