import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LibaryFileRoutingModule } from './libary-file-routing.module';
import { BinManagerComponent } from './bin-manager/bin-manager.component';
import { BinSendComponent } from './bin-send/bin-send.component';
import { SharedModule } from '@shared';

@NgModule({
  declarations: [BinManagerComponent, BinSendComponent],
  imports: [
    CommonModule,
    LibaryFileRoutingModule,
    SharedModule
  ]
})
export class LibaryFileModule { }
