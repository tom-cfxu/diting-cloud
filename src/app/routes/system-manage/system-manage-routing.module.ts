import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserManageComponent } from './user-manage/user-manage.component';
import { WechatComponent } from './wechat/wechat.component';
import { DtuDistributionComponent } from './dtu-distribution/dtu-distribution.component';
import { EquipDefaultConfigComponent } from './equip-default-config/equip-default-config.component';
import { DtuDefaultConfigComponent } from './dtu-default-config/dtu-default-config.component';
import { PasswordFormComponent } from './password-form/password-form.component';
import { UserCenterComponent } from './user-center/user-center.component';


const routes: Routes = [
  { path: '', redirectTo: 'user_manage', pathMatch: 'full' },
  { path: 'user_manage', component: UserManageComponent, data: { title: '用户管理' } },
  { path: 'wxuser_manager', component: WechatComponent, data: { title: '微信用户管理' } },
  { path: 'dtu_default_config', component: DtuDefaultConfigComponent, data: { title: 'DTU默认配置' } },
  { path: 'equip_default_config', component: EquipDefaultConfigComponent, data: { title: '设备默认配置' } },
  { path: 'dtu_distribution', component: DtuDistributionComponent, data: { title: 'DTU分配管理' } },
  { path: 'password_form', component: PasswordFormComponent, data: { title: '密码管理' } },
  { path: 'user_center', component: UserCenterComponent, data: { title: '个人中心' } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SystemManageRoutingModule { }
