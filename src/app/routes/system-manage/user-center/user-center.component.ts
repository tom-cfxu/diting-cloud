import { Component, OnInit, ViewChild } from '@angular/core';
import { SFSchema, SFUISchemaItem, SFComponent } from '@delon/form'
import { RequireService } from '@core/require';
import { SettingsService } from '@delon/theme';
import { StartupService } from '@core';
@Component({
  selector: 'app-user-center',
  templateUrl: './user-center.component.html',
  styles: []
})
export class UserCenterComponent implements OnInit {
  constructor(
    private require: RequireService,
    private settingService: SettingsService,
    private startup: StartupService
  ) { }
  @ViewChild('sf', { static: false }) sf: SFComponent;
  user;
  ui: SFUISchemaItem = {
    email: {
      placeholder: '请输入邮箱',
      spanControl: 6,
    },
    phone: {
      placeholder: '请输入手机',
      spanControl: 6,
    }
  };
  schema: SFSchema = {
    properties: {
      email: {
        type: 'string',
        title: '邮箱',
        format: 'email',
        ui: this.ui.email,
      },
      phone: {
        type: 'string',
        title: '手机',
        format: 'mobile',
        ui: this.ui.phone
      }
    }
  }
  // 获取表单默认值
  getData() {
    const user = this.settingService.user;
    this.user = user;
    this.schema.properties.email.default = this.user.email;
    this.schema.properties.phone.default = this.user.phone;
  }
  submit(value: any) {
    const url = this.require.api.userEdit
    const body = this.require.encodeObject({
      email: value.email,
      phone: value.phone,
    });
    // 修改管理员信息请求
    this.require.post(url, body).subscribe((res: any) => {
      switch (res.code) {
        case "10005":
          this.getUserInfo();
          break;
        default:
          console.log(res);
      }
    }, (err) => {

    })

  }
  // 获取用户信息
  getUserInfo() {
    const url = this.require.api.getUserInfo;
    this.require.post(url).subscribe((res: any) => {
      switch (res.code) {
        case "40002":
          const data = res.data;
          const user: any = {
            id: data.id,
            username: data.username,
            password: data.password,
            email: data.email,
            phone: data.phone,
            folderName: data.folderName,
            roleName: data.roleName,
            parentId: data.parentId,
            path: data.path,
            avatar: './assets/tmp/img/avatar.jpg',
            name: data.username,
            token: this.require.tokenService.get().token,
          };
          let promise = new Promise((resolve) => {
            this.settingService.setUser(user);
            resolve();
          })
          promise.then(() => {
            this.startup.load();
            this.getData()
          })
          break;
        default:
          console.log(res);
      }

    });
  }

  ngOnInit() {
    this.getData();
  }

}
