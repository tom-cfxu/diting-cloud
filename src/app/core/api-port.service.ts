import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiPortService {

  constructor() { }
  public host = 'http://192.168.0.221:8091';
  public addAdminDtu = this.host + '/api/v1.0/addAdminDtu' // 添加所属DTU
  public addToMySelection = this.host + '/api/v1.0/addToMySelection' // 添加到自选
  public addUser = this.host + '/api/v1.0/addUser' // 新增管理员
  public alarmProcess = this.host + '/api/v1.0/alarmProcess' // 查找所有当前报警
  public binDelete = this.host + '/api/v1.0/binDelete' // 删除bin文件
  public changepw = this.host + '/api/v1.0/changepw' // 修改管理员密码
  public deleteAdminDtu = this.host + '/api/v1.0/deleteAdminDtu' // 删除所属DTU
  public deleteUser = this.host + '/api/v1.0/deleteUser' // 删除管理员
  public distributeDtus = this.host + '/api/v1.0/distributeDtus' // 上传所属DTU Excel文件
  public downloadFile = this.host + '/api/v1.0/downloadFile' // 下载bin文件
  public editAdminDtu = this.host + '/api/v1.0/editAdminDtu' // 修改所属DTU
  public getAdminDtus = this.host + '/api/v1.0/getAdminDtus' // DTU归属列表
  public getAlarmHistory = this.host + '/api/v1.0/getAlarmHistory' // 查找自选属性的历史数据
  public getAllAlarm = this.host + '/api/v1.0/getAllAlarm' // 查找所有当前报警
  public getAllEquipments = this.host + '/api/v1.0/getAllEquipments' // DTU完整列表
  public getAllRDB = this.host + '/api/v1.0/getAllRDB' // 获取所有实时标签
  public getBins = this.host + '/api/v1.0/getBins' // 获取bin文件
  public getDtus = this.host + '/api/v1.0/getDtus' // DTU列表
  public getEquipQRs = this.host + '/api/v1.0/getEquipQRs' // 获取设备默认配置
  public getEquipsWithDtu = this.host + '/api/v1.0/getEquipsWithDtu' // 查找DTU下属设备
  public getHistoryData = this.host + '/api/v1.0/getHistoryData' // 查找自选属性的历史数据
  public getMySelection = this.host + '/api/v1.0/getMySelection' // 查找自选
  public getOperateData = this.host + '/api/v1.0/getOperateData' // 查找操作日志
  public getPropertiesWithEquip = this.host + '/api/v1.0/getPropertiesWithEquip' // 查找设备所有属性
  public getUsers = this.host + '/api/v1.0/getUsers' // 管理员列表
  public getWxUsers = this.host + '/api/v1.0/getWxUsers' // 微信用户列表
  public loadAdminTreeData = this.host + '/api/v1.0/loadAdminTreeData' // 管理员父子节点数据
  public realtimeEdit = this.host + '/api/v1.0/realtimeEdit' // 修改实时标签
  public selectionDelete = this.host + '/api/v1.0/selectionDelete' // 删除自选
  public upload = this.host + '/api/v1.0/upload' // 上传bin文件
  public uploadDtuExcel = this.host + '/api/v1.0/uploadDtuExcel' // 上传所属DTU Excel文件
  public userEdit = this.host + '/api/v1.0/userEdit' // 修改管理员信息
  public getUserInfo = this.host + '/api/v1.0/getUserInfo' //获取管理员信息
  public options = {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }
  }
}

