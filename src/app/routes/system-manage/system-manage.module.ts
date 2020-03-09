import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SystemManageRoutingModule } from './system-manage-routing.module';
import { UserManageComponent } from './user-manage/user-manage.component';
import { WechatComponent } from './wechat/wechat.component';
import { DtuDistributionComponent } from './dtu-distribution/dtu-distribution.component';
import { EquipDefaultConfigComponent } from './equip-default-config/equip-default-config.component';
import { DtuDefaultConfigComponent } from './dtu-default-config/dtu-default-config.component';
import { PasswordFormComponent } from './password-form/password-form.component';
import { SharedModule } from '@shared';
import { UserCenterComponent } from './user-center/user-center.component';

@NgModule({
  declarations: [UserManageComponent, WechatComponent, DtuDistributionComponent, EquipDefaultConfigComponent, DtuDefaultConfigComponent, PasswordFormComponent, UserCenterComponent],
  entryComponents: [
  ],
  imports: [
    CommonModule,
    SystemManageRoutingModule,
    SharedModule
  ]
})
export class SystemManageModule { }
