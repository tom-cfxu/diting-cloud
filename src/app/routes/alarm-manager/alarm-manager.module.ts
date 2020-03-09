import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AlarmManagerRoutingModule } from './alarm-manager-routing.module';
import { AlarmProcessComponent } from './alarm-process/alarm-process.component';
import { AlarmHistoryComponent } from './alarm-history/alarm-history.component';
import { SharedModule } from '@shared';


@NgModule({
  declarations: [AlarmProcessComponent, AlarmHistoryComponent],
  imports: [
    CommonModule,
    AlarmManagerRoutingModule,
    SharedModule
  ]
})
export class AlarmManagerModule { }
