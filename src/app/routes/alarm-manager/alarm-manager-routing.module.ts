import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AlarmProcessComponent } from './alarm-process/alarm-process.component';
import { AlarmHistoryComponent } from './alarm-history/alarm-history.component';


const routes: Routes = [
  { path: '', redirectTo: 'alarm_process', pathMatch: 'full' },
  { path: 'alarm_process', component: AlarmProcessComponent, data: { title: '报警处理' } },
  { path: 'alarm_history', component: AlarmHistoryComponent, data: { title: '报警历史' } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AlarmManagerRoutingModule { }
