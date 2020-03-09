import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SimpleGuard } from '@delon/auth';
import { environment } from '@env/environment';
// layout
import { LayoutDefaultComponent } from '../layout/default/default.component';
import { LayoutPassportComponent } from '../layout/passport/passport.component';
// dashboard pages
import { DashboardComponent } from './dashboard/dashboard.component';
// passport pages
import { UserLoginComponent } from './passport/login/login.component';
import { AuthLoginComponent } from './passport/auth-login/auth-login.component';
import { UserRegisterComponent } from './passport/register/register.component';
import { UserRegisterResultComponent } from './passport/register-result/register-result.component';
// single pages
import { CallbackComponent } from './callback/callback.component';
import { UserLockComponent } from './passport/lock/lock.component';
import { RealtimeManageComponent } from './realtime-manage/realtime-manage.component';
import { DataQueryComponent } from './data-query/data-query.component';
import { OperateDataComponent } from './operate-data/operate-data.component';
const routes: Routes = [
  { path: '', redirectTo: 'passport', pathMatch: 'full' },
  {
    path: 'home',
    component: LayoutDefaultComponent,
    canActivate: [SimpleGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent, data: { title: '主界面' } },
      { path: 'system_manage', loadChildren: () => import('./system-manage/system-manage.module').then(m => m.SystemManageModule), data: { title: '系统管理' } },
      { path: 'dtu', loadChildren: () => import('./dtu-manage/dtu-manage.module').then(m => m.DtuManageModule), data: { title: 'DTU管理' } },
      { path: 'realtime_manage', component: RealtimeManageComponent, data: { title: '实时数据' } },
      { path: 'libary_file', loadChildren: () => import('./libary-file/libary-file.module').then(m => m.LibaryFileModule), data: { title: '库文件' } },
      { path: 'alarm', loadChildren: () => import('./alarm-manager/alarm-manager.module').then(m => m.AlarmManagerModule), data: { title: '报警管理' } },
      { path: 'data_query', component: DataQueryComponent, data: { title: '历史数据' } },
      { path: 'operate_data', component: OperateDataComponent, data: { title: '操作日志' } },
      // 业务子模块
      // { path: 'widgets', loadChildren: () => import('./widgets/widgets.module').then(m => m.WidgetsModule) },
    ]
  },
  // 全屏布局
  // {
  //     path: 'fullscreen',
  //     component: LayoutFullScreenComponent,
  //     children: [
  //     ]
  // },
  // passport
  {
    path: 'passport',
    component: LayoutPassportComponent,
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', component: UserLoginComponent, data: { title: '登录' } },
      // { path: 'register', component: UserRegisterComponent, data: { title: '注册' } },
      // { path: 'register-result', component: UserRegisterResultComponent, data: { title: '注册结果' } },
      // { path: 'lock', component: UserLockComponent, data: { title: '锁屏' } },
    ]
  },
  // 单页不包裹Layout
  { path: 'callback/:type', component: CallbackComponent },
  { path: 'exception', loadChildren: () => import('./exception/exception.module').then(m => m.ExceptionModule) },
  { path: '**', redirectTo: 'exception/404' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      routes, {
      useHash: environment.useHash,
      // NOTICE: If you use `reuse-tab` component and turn on keepingScroll you can set to `disabled`
      // Pls refer to https://ng-alain.com/components/reuse-tab
      scrollPositionRestoration: 'top',
    }
    )],
  exports: [RouterModule],
})
export class RouteRoutingModule { }
