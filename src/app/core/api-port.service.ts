import { Injectable } from '@angular/core';
import { HostService } from './host.service';

@Injectable({
  providedIn: 'root'
})
export class ApiPortService {
  constructor(private hostService: HostService) { }
  public addAdminDtu = this.hostService.host + '/api/v1.0/addAdminDtu' // 添加所属DTU
  public addToMySelection = this.hostService.host + '/api/v1.0/addToMySelection' // 添加到自选
  public addUser = this.hostService.host + '/api/v1.0/addUser' // 新增管理员
  public alarmProcess = this.hostService.host + '/api/v1.0/alarmProcess' // 查找所有当前报警
  public binDelete = this.hostService.host + '/api/v1.0/binDelete' // 删除bin文件
  public changepw = this.hostService.host + '/api/v1.0/changepw' // 修改管理员密码
  public deleteAdminDtu = this.hostService.host + '/api/v1.0/deleteAdminDtu' // 删除所属DTU
  public deleteUser = this.hostService.host + '/api/v1.0/deleteUser' // 删除管理员
  public distributeDtus = this.hostService.host + '/api/v1.0/distributeDtus' // 分配DTU
  public downloadFile = this.hostService.host + '/api/v1.0/downloadFile' // 下载bin文件
  public editAdminDtu = this.hostService.host + '/api/v1.0/editAdminDtu' // 修改所属DTU
  public getAdminDtus = this.hostService.host + '/api/v1.0/getAdminDtus' // DTU归属列表
  public getAlarmHistory = this.hostService.host + '/api/v1.0/getAlarmHistory' // 查找自选属性的历史数据
  public getAllAlarm = this.hostService.host + '/api/v1.0/getAllAlarm' // 查找所有当前报警
  public getAllEquipments = this.hostService.host + '/api/v1.0/getAllEquipments' // DTU完整列表
  public getAllRDB = this.hostService.host + '/api/v1.0/getAllRDB' // 获取所有实时标签
  public getBins = this.hostService.host + '/api/v1.0/getBins' // 获取bin文件
  public getDtus = this.hostService.host + '/api/v1.0/getDtus' // DTU列表
  public getEquipQRs = this.hostService.host + '/api/v1.0/getEquipQRs' // 获取设备默认配置
  public getEquipsWithDtu = this.hostService.host + '/api/v1.0/getEquipsWithDtu' // 查找DTU下属设备
  public getHistoryData = this.hostService.host + '/api/v1.0/getHistoryData' // 查找自选属性的历史数据
  public getMySelection = this.hostService.host + '/api/v1.0/getMySelection' // 查找自选
  public getOperateData = this.hostService.host + '/api/v1.0/getOperateData' // 查找操作日志
  public getPropertiesWithEquip = this.hostService.host + '/api/v1.0/getPropertiesWithEquip' // 查找设备所有属性
  public getUsers = this.hostService.host + '/api/v1.0/getUsers' // 管理员列表
  public getWxUsers = this.hostService.host + '/api/v1.0/getWxUsers' // 微信用户列表
  public loadAdminTreeData = this.hostService.host + '/api/v1.0/loadAdminTreeData' // 管理员父子节点数据
  public realtimeEdit = this.hostService.host + '/api/v1.0/realtimeEdit' // 修改实时标签
  public selectionDelete = this.hostService.host + '/api/v1.0/selectionDelete' // 删除自选
  public upload = this.hostService.host + '/api/v1.0/upload' // 上传bin文件
  public uploadDtuExcel = this.hostService.host + '/api/v1.0/uploadDtuExcel' // 上传所属DTU Excel文件
  public userEdit = this.hostService.host + '/api/v1.0/userEdit' // 修改管理员信息
  public getUserInfo = this.hostService.host + '/api/v1.0/getUserInfo' // 获取管理员信息
  public getAllGateways = this.hostService.host + '/api/v1.0/getAllGateways' // 获取所有DTU
  public uploadHtml = this.hostService.host + '/api/v1.0/uploadHtml' // 上传所属自定义html文件2
  public uploadHtml2 = this.hostService.host + '/api/v1.0/uploadHtml2' // 上传所属自定义html文件2
  public getHtmlNames = this.hostService.host + '/api/v1.0/getHtmlNames' // 获取自定义html文件名
  public getHtmlContent = this.hostService.host + '/api/v1.0/getHtmlContent' // 获取自定义html文件内容
  public getHtmlContent2 = this.hostService.host + '/api/v1.0/getHtmlContent2' // 获取自定义html文件内容2
  public deleteHtmlFile = this.hostService.host + '/api/v1.0/deleteHtmlFile' // 删除html文件
  public deleteHtmlFile2 = this.hostService.host + '/api/v1.0/deleteHtmlFile2' // 删除html文件2
  public getHtmlUrl = this.hostService.host + '/api/v1.0/getHtmlUrl' // 获取自定义html url地址
  public options = {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }
  }
}

