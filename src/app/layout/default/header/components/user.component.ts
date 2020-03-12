import { Component, Inject, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { SettingsService, } from '@delon/theme';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { UrlApiService } from '@core/url-api.service';
// tslint:disable-next-line: no-duplicate-imports
import { _HttpClient } from '@delon/theme';
import { LoginControllerService } from '@core/login-controller.service';
import { NzNotificationService } from 'ng-zorro-antd';

@Component({
  selector: 'header-user',
  template: `
    <div
      class="alain-default__nav-item d-flex align-items-center px-sm"
      nz-dropdown
      nzPlacement="bottomRight"
      [nzDropdownMenu]="userMenu"
    >
      <nz-avatar [nzSrc]="settings.user.avatar" nzSize="small" class="mr-sm"></nz-avatar>
      {{ settings.user.name }}
    </div>
    <nz-dropdown-menu #userMenu="nzDropdownMenu">
      <div nz-menu class="width-sm">
        <div nz-menu-item routerLink="/home/system_manage/user_center">
          <i nz-icon nzType="user" class="mr-sm"></i>
          {{ 'menu.account.center' | translate }}
        </div>
        <div nz-menu-item routerLink="/pro/account/settings">
          <i nz-icon nzType="setting" class="mr-sm"></i>
          {{ 'menu.account.settings' | translate }}
        </div>
        <div nz-menu-item routerLink="/exception/trigger">
          <i nz-icon nzType="close-circle" class="mr-sm"></i>
          {{ 'menu.account.trigger' | translate }}
        </div>
        <li nz-menu-divider></li>
        <div nz-menu-item (click)="logout()">
          <i nz-icon nzType="logout" class="mr-sm"></i>
          {{ 'menu.account.logout' | translate }}
        </div>
      </div>
    </nz-dropdown-menu>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderUserComponent {
  constructor(
    public settings: SettingsService,
    private router: Router,
    private loginApi: LoginControllerService,
    private http: _HttpClient,
    private notification: NzNotificationService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
  ) { }

  logout() {
    const url = this.loginApi.logout;
    const token = this.tokenService.get().token;
    const options = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    };
    const body = `token=${token}`
    this.http.post(url, body, null, options).subscribe((res) => {
      // console.log(res);
      this.router.navigateByUrl(this.tokenService.login_url!);
      this.notification.info(`注销成功`, ``, { nzDuration: 1000 })
      this.tokenService.clear();
    }, (err) => {
      this.tokenService.clear();
      this.router.navigateByUrl(this.tokenService.login_url!);
    })
  }
}
