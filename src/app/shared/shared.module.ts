import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
// delon
import { AlainThemeModule } from '@delon/theme';
import { DelonABCModule } from '@delon/abc';
import { DelonACLModule } from '@delon/acl';
import { DelonFormModule } from '@delon/form';
import { DelonChartModule } from '@delon/chart';
// i18n
import { TranslateModule } from '@ngx-translate/core';

// #region third libs
import { NgZorroAntdModule } from 'ng-zorro-antd';
// import { NzFormModule } from 'ng-zorro-antd/form';
import { CountdownModule } from 'ngx-countdown';
import { NgxEchartsModule } from 'ngx-echarts'
const THIRDMODULES = [NgZorroAntdModule, CountdownModule];
// #endregion

import { NzTableModule } from 'ng-zorro-antd/table';
import { GenderPipe } from '../pipe/gender.pipe';
// #region your componets & directives
const COMPONENTS = [
];
const DIRECTIVES = [
  GenderPipe
];
// #endregion

// #NzModule


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    AlainThemeModule.forChild(),
    DelonABCModule,
    DelonACLModule,
    DelonFormModule,
    NzTableModule,
    NgxEchartsModule,
    NgZorroAntdModule,
    // NzFormModule,
    DelonChartModule,
    // third libs
    ...THIRDMODULES,
  ],
  declarations: [
    // your components
    ...COMPONENTS,
    ...DIRECTIVES,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    AlainThemeModule,
    DelonABCModule,
    DelonACLModule,
    DelonFormModule,
    NgZorroAntdModule,
    NzTableModule,
    DelonChartModule,
    // NzFormModule,
    // i18n
    TranslateModule,
    // third libs
    ...THIRDMODULES,
    // your components
    ...COMPONENTS,
    ...DIRECTIVES,
  ],
})
export class SharedModule { }
