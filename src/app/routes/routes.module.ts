import { NgModule } from '@angular/core';

import { SharedModule } from '@shared';
import { RouteRoutingModule } from './routes-routing.module';
// dashboard pages
import { DashboardComponent } from './dashboard/dashboard.component';
// passport pages
import { UserLoginComponent } from './passport/login/login.component';
import { UserRegisterComponent } from './passport/register/register.component';
import { UserRegisterResultComponent } from './passport/register-result/register-result.component';
// single pages
import { CallbackComponent } from './callback/callback.component';
import { UserLockComponent } from './passport/lock/lock.component';
import { SystemManageModule } from './system-manage/system-manage.module';
import { DtuManageModule } from './dtu-manage/dtu-manage.module';
import { RealtimeManageComponent } from './realtime-manage/realtime-manage.component';
import { LibaryFileModule } from './libary-file/libary-file.module';
import { AlarmManagerModule } from './alarm-manager/alarm-manager.module';
import { DataQueryComponent } from './data-query/data-query.component';
import { OperateDataComponent } from './operate-data/operate-data.component';
import { SearchModalComponent } from './component/search-modal';
import { NgxEchartsModule } from 'ngx-echarts';
import { UserPageComponent } from './user-page/user-page.component';
// import { RoutesUserPageComponent } from './user-page/user-page/user-page.component';

const COMPONENTS = [
  DashboardComponent,
  // passport pages
  UserLoginComponent,
  UserRegisterComponent,
  UserRegisterResultComponent,
  // single pages
  CallbackComponent,
  UserLockComponent,
  RealtimeManageComponent,
  DataQueryComponent,
  OperateDataComponent,
  SearchModalComponent];
const COMPONENTS_NOROUNT = [SearchModalComponent];

@NgModule({
  imports: [SharedModule, NgxEchartsModule, RouteRoutingModule, SystemManageModule, DtuManageModule, LibaryFileModule, AlarmManagerModule],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT,
    UserPageComponent,
  ],
  entryComponents: COMPONENTS_NOROUNT
})
export class RoutesModule { }
