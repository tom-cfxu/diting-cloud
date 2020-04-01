import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpErrorResponse,
  HttpEvent,
  HttpResponseBase,
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { mergeMap, catchError } from 'rxjs/operators';
import { NzMessageService, NzNotificationService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { environment } from '@env/environment';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';

const CODEMESSAGE = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};
const TIME = { nzDuration: 1000 };
const ERRTIME = { nzDuration: 5000 };
const RESPONSE = {
  10001: '登录成功,欢迎您',
  10002: '注销成功!',
  10003: '请求头没有带token',
  10004: 'token已过期,需要重新onLogin',
  10005: '成功!',
  10006: '操作失败',
  10007: '参数错误,缺少参数/请求的参数进行类型转换失败',
  10008: '当前用户没有修改dtu参数的权限',
  10009: '设备与dtu已绑定',
  10010: 'dtu已更换拥有者',
  10011: '读/写超时',
  10012: '新DTU编号已注册,替换失败',


  40001: '登录失败,账号密码错误',
  40002: '登录失败,账号密码错误',
  40003: '无token,请先登录',
  40004: 'token过期,请重新登录',
  40005: '登录失败,账号密码错误',
  40006: 'dtu不存在'
}
/**
 * 默认HTTP拦截器，其注册细节见 `app.module.ts`
 */
@Injectable()
export class DefaultInterceptor implements HttpInterceptor {
  constructor(private injector: Injector) { }

  private get notification(): NzNotificationService {
    return this.injector.get(NzNotificationService);
  }
  private get messageService(): NzMessageService {
    return this.injector.get(NzMessageService);
  }
  private goTo(url: string) {
    setTimeout(() => this.injector.get(Router).navigateByUrl(url));
  }

  private checkStatus(ev: HttpResponseBase) {
    const errortext = CODEMESSAGE[ev.status] || ev.statusText;
    if ((ev.status >= 200 && ev.status < 300) || ev.status === 401) {
      return;
    } else if (ev.status === 0) {
      // this.notification.error(`token过期`, `请重新登录`);
      // this.goTo('/passport/login');
    } else {
      this.notification.error(`请求失败 ${ev.status}`, errortext, ERRTIME);
    }

  }
  private isNull(value) {
    if (value === null) {
      return true;
    } else {
      return false;
    }
  }
  private handleData(ev: HttpResponseBase): Observable<any> {
    // 可能会因为 `throw` 导出无法执行 `_HttpClient` 的 `end()` 操作
    if (ev.status > 0) {
      this.injector.get(_HttpClient).end();
    }
    this.checkStatus(ev);
    // 业务处理：一些通用操作
    switch (ev.status) {
      case 200:
        const res = (ev as any).body;
        const responsetext = RESPONSE[res.code] || ev.statusText;
        switch (res.code) {
          case "10002":
            break;
          case "10001":
            break;
          case "10005":
            this.messageService.success(`${this.isNull(res.msg) ? responsetext : res.msg}`, TIME);
            break;
          case "10006":
            this.messageService.error(`${this.isNull(res.msg) ? `错误类型:${responsetext}` : '提示:' + res.msg}`, ERRTIME);
            break;
          case "40002":
            break;
          case "40004":
            this.notification.error(`登录已过期，请重新登录`, ``);
            //清空 token 信息
            (this.injector.get(DA_SERVICE_TOKEN) as ITokenService).clear();
            this.goTo('/passport/login');
            break
          case "10003":
          case "10004":
          case "10007":
          case "10008":
          case "10009":
          case "10010":
          case "10011":
          case "10012":
          case "40001":
          case "40003":
          case "40005":
          case "40006":
            this.notification.error(`错误码:${res.code}`, `${this.isNull(res.msg) ? `错误类型:${responsetext}` : '提示:' + res.msg}`, ERRTIME)
            break;
        }
        break;
      case 401:
        break;
      case 404:
      case 403:
      case 500:
        // const errortext = CODEMESSAGE[ev.status] || ev.statusText;
        // this.notification.error(`请求失败 ${ev.status}`, errortext, ERRTIME);
        // this.goTo(`/exception/${ev.status}`);
        // this.goTo('/passport/login');
        break;
      default:
        if (ev instanceof HttpErrorResponse) {
          console.warn('未可知错误，大部分是由于后端不支持CORS或无效配置引起', ev);
          // this.notification.error(`登录过期`, `请重新登录`, TIME)
          // this.goTo('/passport/login');
          return throwError(ev);
        }
        break;
    }
    return of(ev);
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // 统一加上服务端前缀
    let url = req.url;
    if (!url.startsWith('https://') && !url.startsWith('http://')) {
      url = environment.SERVER_URL + url;
    }
    const newReq = req.clone({ url });
    return next.handle(newReq).pipe(
      mergeMap((event: any) => {
        // 允许统一对请求错误处理
        if (event instanceof HttpResponseBase) return this.handleData(event);
        // 若一切都正常，则后续操作
        return of(event);
      }),
      catchError((err: HttpErrorResponse) => this.handleData(err)),
    );
  }
}
