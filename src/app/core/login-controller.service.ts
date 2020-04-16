import { Injectable } from '@angular/core';
import { HostService } from './host.service';
@Injectable({
  providedIn: 'root'
})
export class LoginControllerService {
  constructor(private hostService: HostService) { }
  public login = this.hostService.host + '/api/account/login'; // 登录
  public logout = this.hostService.host + '/api/account/logout'; // 注销
  public getUserInfo = this.hostService.host + '/api/v1.0/getUserInfo'; // 获取管理员信息

}
