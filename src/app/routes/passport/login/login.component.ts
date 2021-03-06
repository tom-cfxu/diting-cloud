import { SettingsService, _HttpClient, MenuService } from '@delon/theme';
import { Component, OnDestroy, Inject, Optional } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzMessageService, NzModalService, NzNotificationService } from 'ng-zorro-antd';
import { SocialService, SocialOpenType, ITokenService, DA_SERVICE_TOKEN } from '@delon/auth';
import { ReuseTabService } from '@delon/abc';
import { environment } from '@env/environment';
import { StartupService } from '@core';
import { LoginControllerService } from '@core/login-controller.service';
@Component({
  selector: 'passport-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less'],
  providers: [SocialService],
})
export class UserLoginComponent implements OnDestroy {
  constructor(
    fb: FormBuilder,
    modalSrv: NzModalService,
    private router: Router,
    private settingsService: SettingsService,
    private socialService: SocialService,
    @Optional()
    @Inject(ReuseTabService)
    private reuseTabService: ReuseTabService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    private startupSrv: StartupService,
    public http: _HttpClient,
    public msg: NzMessageService,
    private loginControl: LoginControllerService,
    private notification: NzNotificationService, // private require: RequireService,
  ) {
    this.form = fb.group({
      userName: [null, [Validators.required, Validators.minLength(4)]],
      password: [null, Validators.required],
      mobile: [null, [Validators.required, Validators.pattern(/^1\d{10}$/)]],
      captcha: [null, [Validators.required]],
      remember: [true],
    });
    modalSrv.closeAll();
  }
  // #region fields

  get userName() {
    return this.form.controls.userName;
  }
  get password() {
    return this.form.controls.password;
  }
  get mobile() {
    return this.form.controls.mobile;
  }
  get captcha() {
    return this.form.controls.captcha;
  }
  form: FormGroup;
  error = '';
  type = 0;

  // #region get captcha

  count = 0;
  interval$: any;

  // #endregion

  switch(ret: any) {
    this.type = ret.index;
  }
  // tslint:disable-next-line: member-ordering
  options = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  };
  getCaptcha() {
    if (this.mobile.invalid) {
      this.mobile.markAsDirty({ onlySelf: true });
      this.mobile.updateValueAndValidity({ onlySelf: true });
      return;
    }
    this.count = 59;
    this.interval$ = setInterval(() => {
      this.count -= 1;
      if (this.count <= 0) {
        clearInterval(this.interval$);
      }
    }, 1000);
  }
  // #endregion
  // 登录
  submit() {
    const Loginurl = this.loginControl.login;
    const body = `username=${this.userName.value}&password=${this.password.value}`;
    this.error = '';
    if (this.type === 0) {
      this.userName.markAsDirty();
      this.userName.updateValueAndValidity();
      this.password.markAsDirty();
      this.password.updateValueAndValidity();
      if (this.userName.invalid || this.password.invalid) {
        return;
      }
    } else {
      this.mobile.markAsDirty();
      this.mobile.updateValueAndValidity();
      this.captcha.markAsDirty();
      this.captcha.updateValueAndValidity();
      if (this.mobile.invalid || this.captcha.invalid) {
        return;
      }
    }
    // c0d416c0590c4693bbdc56ecbe65e2f5
    // 默认配置中对所有HTTP请求都会强制 [校验](https://ng-alain.com/auth/getting-started) 用户 Token
    // 然一般来说登录请求不需要校验，因此可以在请求URL加上：`/login?_allow_anonymous=true` 表示不触发用户 Token 校验
    this.http.post(Loginurl + `?_allow_anonymous=true`, body, null, this.options).subscribe(
      (res: any) => {
        if (res.code === '10001') {
          // 清空路由复用信息
          this.reuseTabService.clear();
          // 设置用户Token信息
          this.tokenService.set({ token: res.data.token });
          // 再发送请求获取用户信息
          this.getUserInfo().then((user) => {
            this.settingsService.setUser(user);
            user = JSON.stringify(user);
            localStorage.setItem('user', user);
            this.startupSrv.load().then(() => {
              let url = this.tokenService.referrer!.url || '/home';
              if (url.includes('/passport')) {
                url = '/home';
              }
              this.router.navigateByUrl(url);
            });
            // 欢迎用户
            this.notification.success('登录成功!', `欢迎您:${this.settingsService.user.name}`, { nzDuration: 1000 });
          })
          // 重新获取 StartupService 内容，我们始终认为应用信息一般都会受当前用户授权范围而影响
          // console.log(this.startupSrv.menuService.menus);
          // const newMenu: Menu[] = [
          //   {
          //     key: 'newMenu',
          //     text: '自定义',
          //     link: '/home/operate_data',
          //     icon: { type: 'icon', value: 'line-chart' },
          //   },
          // ];
          // this.startupSrv.menuService.menus[0].children.push(newMenu[0]);
          // this.startupSrv.menuService.add(this.startupSrv.menuService.menus);
          // console.log(this.startupSrv.menuService.menus[0]);
          // this.startupSrv.menuService.setItem('newMenu', newMenu);

        } else if (res.code === '40001' || res.code === '40002') {
          this.notification.error('登录失败', '用户名或密码错误,请检查');
        }
      },
      err => {
        console.log(err);
      },
    );
  }
  // 获取用户信息
  getUserInfo(): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = this.loginControl.getUserInfo;
      const options = this.options;
      const body = `token=${this.tokenService.get().token}`;
      let user: any;
      this.http.post(url, body, null, options).subscribe((res: any) => {
        const data = res.data;
        user = {
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
          token: this.tokenService.get().token,
        };
        resolve(user);
      });

    })
  }
  // #region social

  open(type: string, openType: SocialOpenType = 'href') {
    let url = ``;
    let callback = ``;
    // tslint:disable-next-line: prefer-conditional-expression
    if (environment.production) {
      callback = 'https://ng-alain.github.io/ng-alain/#/callback/' + type;
    } else {
      callback = 'http://localhost:4200/#/callback/' + type;
    }
    switch (type) {
      case 'auth0':
        url = `//cipchk.auth0.com/login?client=8gcNydIDzGBYxzqV0Vm1CX_RXH-wsWo5&redirect_uri=${decodeURIComponent(
          callback,
        )}`;
        break;
      case 'github':
        url = `//github.com/login/oauth/authorize?client_id=9d6baae4b04a23fcafa2&response_type=code&redirect_uri=${decodeURIComponent(
          callback,
        )}`;
        break;
      case 'weibo':
        url = `https://api.weibo.com/oauth2/authorize?client_id=1239507802&response_type=code&redirect_uri=${decodeURIComponent(
          callback,
        )}`;
        break;
    }
    if (openType === 'window') {
      this.socialService
        .login(url, '/', {
          type: 'window',
        })
        .subscribe(res => {
          if (res) {
            this.settingsService.setUser(res);
            this.router.navigateByUrl('/');
          }
        });
    } else {
      this.socialService.login(url, '/', {
        type: 'href',
      });
    }
  }

  // #endregion

  ngOnDestroy(): void {
    if (this.interval$) {
      clearInterval(this.interval$);
    }
  }
}
