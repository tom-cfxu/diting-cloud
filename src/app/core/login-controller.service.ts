import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class LoginControllerService {
  public host = 'http://192.168.0.221:8091';
  public login = this.host + '/api/account/login'; // 登录
  public logout = this.host + '/api/account/logout'; // 注销
  public getUserInfo = this.host + '/api/v1.0/getUserInfo'; //获取管理员信息
  constructor() { }
}
