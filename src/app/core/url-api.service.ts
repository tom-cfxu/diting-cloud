import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UrlApiService {
  private host = "https://www.fzditing.com/";
  private loginApi = "api/account/";
  private serve = "api/v1.0/";
  public login = this.Log("login"); // 登录
  public logout = this.Log("logout"); // 注销
  public getDtus = this.serviceApi("getDtus"); // 获取DTU列表
  public getAllEquipments = this.serviceApi("getAllEquipments"); // 获取所有dtu设备
  public getUsers = this.serviceApi("getUsers"); // 获取用户
  public deleteUserApi = this.serviceApi("deleteUser"); // 删除用户
  private serviceApi(url) {
    return this.host + this.serve + url;
  };
  private Log(url) {
    return this.host + this.loginApi + url;
  };
  constructor() { }
}
