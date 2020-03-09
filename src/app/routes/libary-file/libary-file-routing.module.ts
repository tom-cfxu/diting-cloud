import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BinManagerComponent } from './bin-manager/bin-manager.component';
import { BinSendComponent } from './bin-send/bin-send.component';

const routes: Routes = [
  { path: '', redirectTo: 'bin_manager', pathMatch: 'full' },
  { path: 'bin_manager', component: BinManagerComponent, data: { title: '文件管理' } },
  { path: 'bin_send', component: BinSendComponent, data: { title: '文件下发' } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LibaryFileRoutingModule { }
