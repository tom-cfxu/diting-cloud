import { Component, OnInit } from "@angular/core";

@Component({
  selector: 'app-search-modal',
  template: `
  <div nz-col nzMd="2" nzSm="24">
    <nz-form-item>
      <nz-form-control nzSpan="24">
        <nz-select [(ngModel)]="q.status" name="status" id="status" (ngModelChange)="qChange($event)"
          [nzShowSearch]="true">
          <nz-option *ngFor="let i of status; let idx = index" [nzLabel]="i.text" [nzValue]="i.value"></nz-option>
        </nz-select>
      </nz-form-control>
    </nz-form-item>
  </div>
  <div nz-col nzMd="5" nzSm="24">
    <nz-form-item>
      <nz-form-control nzSpan="24">
        <nz-input-group nzSearch [nzAddOnAfter]="suffixIconButton">
          <input type="text" nz-input placeholder="请输入" />
        </nz-input-group>
        <ng-template #suffixIconButton>
          <button nz-button nzType="primary" nzSearch><i nz-icon nzType="search"></i></button>
        </ng-template>
      </nz-form-control>
    </nz-form-item>
  </div>
  <div nz-col nzMd="2" nzSm="24">
    <nz-form-item>
      <nz-form-control nzSpan="24">
        <button nz-button type="reset">
          <i nz-icon nzType="redo"></i>
          <span>清空</span>
        </button>
      </nz-form-control>
    </nz-form-item>
  </div>
  `,
  styles: [`
    `]
})
export class SearchModalComponent implements OnInit {
  // 搜索配置
  q: any = {
    status: "id",
  }
  condition: any;
  input = '';
  status = [
    { index: 0, text: 'ID', value: "id", checked: true },
    { index: 1, text: '用户名', value: "username", checked: false },
    { index: 2, text: '邮箱', value: "email", checked: false },
    { index: 3, text: '手机', value: "phone", checked: false },
  ];
  qChange($event) {

  }
  constructor() {

  }
  ngOnInit() {

  }
}
