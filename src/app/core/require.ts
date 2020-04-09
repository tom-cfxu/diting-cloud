import { Injectable, Inject } from '@angular/core';
import { ITokenService, DA_SERVICE_TOKEN } from '@delon/auth';
import { _HttpClient, SettingsService } from '@delon/theme';
import { ApiPortService } from './api-port.service';
import { LoginControllerService } from './login-controller.service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import * as moment from 'moment'

@Injectable({ providedIn: 'root' })
export class RequireService {
    constructor(
        @Inject(DA_SERVICE_TOKEN) public tokenService: ITokenService,
        public settingsService: SettingsService,
        public api: ApiPortService,
        public loginApi: LoginControllerService,
        public http: _HttpClient,
        public message: NzMessageService,
        public modal: NzModalService
    ) { }
    // post 请求
    public post(Url, Body?, Param?, Options?) {
        const url = Url;
        let body;
        const token = this.tokenService.get().token;
        if (Body !== undefined && Body !== null) {
            body = Body;
            body += `&token=${token}`;
        } else {
            body = `token=${token}`;
        }
        const param = Param || null;
        const options = Options || { headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' } };
        return this.http.post(url, body, param, options);
    }
    // 数组转,字符串 //[1,2] =>str=1,2
    public encodeString(arr: Array<string>, str) {
        return `${str}=${arr.join(',')}`
    }
    // 数组转&字符串 //[1,2] => str=1&str=2
    public encodeArray(arr: Array<string>, str) {
        return arr.map((e) => `${str}=${e}`).join('&')
    }
    // 对象转&字符串 //{name:'tom',pwd:'123'} => name=tom&pwd=123
    public encodeObject(obj) {
        const arr = [];
        // tslint:disable-next-line: forin
        for (const i in obj) {
            arr.push(i + '=' + obj[i]);
        }
        return arr.join('&')
    };
    // 删除数组中的重复对象
    public deteleObject(obj) {
        let uniques = [];
        // tslint:disable-next-line: prefer-const
        let stringify = {};
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < obj.length; i++) {
            const keys = Object.keys(obj[i]);
            // tslint:disable-next-line: only-arrow-functions
            keys.sort(function (a, b) {
                return (Number(a) - Number(b));
            });
            let str = '';
            // tslint:disable-next-line: prefer-for-of
            for (let j = 0; j < keys.length; j++) {
                str += JSON.stringify(keys[j]);
                str += JSON.stringify(obj[i][keys[j]]);
            }
            if (!stringify.hasOwnProperty(str)) {
                uniques.push(obj[i]);
                stringify[str] = true;
            }
        }
        uniques = uniques;
        return uniques;
    }
    // tslint:disable-next-line: member-ordering
    public moment = moment;
    // 主界面获取用户信息
    public getUserInfo() {
        const url = this.api.getUserInfo;
        this.post(url, null).subscribe((res: any) => {
            // console.log(res)
            const data = res.data;
            const user: any = {
                id: data.id,
                username: data.username,
                password: data.password,
                email: data.email,
                phone: data.phone,
                folderName: data.folderName,
                roleName: data.roleName,
                parentId: data.parentId,
                path: data.path,
                avatar: './assets/tmp/img/avatar.jpg',
                name: data.username,
                token: this.tokenService.get().token,
            };
            this.settingsService.setUser(user);
        });
    }


}