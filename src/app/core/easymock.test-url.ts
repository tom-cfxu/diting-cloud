import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
// tslint:disable-next-line: class-name
export class TestPortService {
  public baseUrl = "http://mengxuegu.com:7300/mock";
  public ProjectID = "/5d8ed6df993a01623de5b51b";
  public getDtuDefault = this.port(this.baseUrl, this.ProjectID, '/getDtuDefault');
  public getWechatUser = this.port(this.baseUrl, this.ProjectID, '/getWechatUser');
  public getEquip = this.port(this.baseUrl, this.ProjectID, '/getEquip');
  public getAllEquipments = this.port(this.baseUrl, this.ProjectID, '/getAllEquipments');
  public getRealtimeData = this.port(this.baseUrl, this.ProjectID, '/getRealtimeData');
  public getFileData = this.port(this.baseUrl, this.ProjectID, '/getFileData');
  port(a, b, c) {
    return a + b + c;
  };
  constructor() { }
}
