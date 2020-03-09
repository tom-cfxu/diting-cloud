import { Component, OnInit } from '@angular/core';
import { SFSchema } from '@delon/form';
import { RequireService } from '@core/require';

@Component({
  selector: 'app-password-form',
  templateUrl: './password-form.component.html',
  styles: []
})
export class PasswordFormComponent implements OnInit {
  constructor(
    private require: RequireService,
  ) { }
  ui = {
    spanLabel: 6,
    spanControl: 4
  }
  schema: SFSchema = {
    required: ['oldpw', 'newpw', 'rpNewpw'],
    properties: {
      oldpw: {
        title: '原密码',
        type: 'string',
        ui: {
          type: 'password',
        }

      },
      newpw: {
        title: '新密码',
        type: 'string',
        ui: {
          type: 'password',
        }
      },
      rpNewpw: {
        title: '重复新密码',
        type: 'string',
        ui: {
          type: 'password',
          // validator: (value: any,newpw) => {
          // return form.value.name === 'cipchk' ? [] : [{ keyword: 'required', message: '必须是cipchk@qq.com'}];
        }
      },
    }
  };
  // 提交密码修改
  submit(value) {
    const url = this.require.api.changepw;
    const body = this.require.encodeObject({
      oldpw: value.oldpw,
      newpw: value.newpw,
    });
    try {
      this.require.post(url, body).subscribe((res) => {
        console.log(res)
      }, (err) => {

      })
    } catch (err) {

    }

  }
  ngOnInit(): void {

  }

}
