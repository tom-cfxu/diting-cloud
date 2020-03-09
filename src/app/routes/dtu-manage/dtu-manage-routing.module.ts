import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DtuOnlineComponent } from './dtu-online/dtu-online.component';


const routes: Routes = [
  { path: '', redirectTo: 'dtu_manager', pathMatch: 'full' },
  { path: 'dtu_manager', component: DtuOnlineComponent, data: { title: 'DTU在线管理' } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DtuManageRoutingModule { }
