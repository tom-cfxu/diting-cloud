import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DtuManageRoutingModule } from './dtu-manage-routing.module';
import { DtuOnlineComponent } from './dtu-online/dtu-online.component';
import { SharedModule } from '@shared';
@NgModule({
  declarations: [DtuOnlineComponent],
  imports: [
    CommonModule,
    DtuManageRoutingModule,
    SharedModule,
  ],
})
export class DtuManageModule { }
