import { Injectable, Injector, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { zip } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MenuService, SettingsService, TitleService, ALAIN_I18N_TOKEN, _HttpClient } from '@delon/theme';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { ACLService } from '@delon/acl';
import { TranslateService } from '@ngx-translate/core';
import { I18NService } from '../i18n/i18n.service';

import { NzIconService } from 'ng-zorro-antd/icon';
import { ICONS_AUTO } from '../../../style-icons-auto';
import { ICONS } from '../../../style-icons';

interface MenuIcon {
  /** Type for icon */
  type: 'class' | 'icon' | 'iconfont' | 'img';
  /** Value for the icon, can be set Class Name, nz-icon of `nzType`, image */
  value?: string;
  /** Type of the ant design icon, default: `outline` */
  theme?: 'outline' | 'twotone' | 'fill';
  /** Rotate icon with animation, default: `false` */
  spin?: boolean;
  /** Only support the two-tone icon. Specific the primary color */
  twoToneColor?: string;
  /** Type of the icon from iconfont */
  iconfont?: string;
}
interface Menu {
  [key: string]: any;
  /** Text of menu item, can be choose one of  `text` or `i18n` (Support HTML) */
  text?: string;
  /** I18n key of menu item, can be choose one of  `text` or `i18n` (Support HTML) */
  i18n?: string;
  /** Whether to display the group name, default: `true` */
  group?: boolean;
  /** Routing for the menu item, can be choose one of `link` or `externalLink` */
  link?: string;
  /** External link for the menu item, can be choose one of `link` or `externalLink` */
  externalLink?: string;
  /** Specifies `externalLink` where to display the linked URL */
  target?: '_blank' | '_self' | '_parent' | '_top';
  /** Icon for the menu item, only valid for the first level menu */
  icon?: string | MenuIcon | null;
  /** Badget for the menu item when `group` is `true` */
  badge?: number;
  /** Whether to display a red dot instead of `badge` value */
  badgeDot?: boolean;
  /** Badge [color](https://ng.ant.design/components/badge/en#nz-badge) */
  badgeStatus?: string;
  /** Whether disable for the menu item */
  disabled?: boolean;
  /** Whether hidden for the menu item */
  hide?: boolean;
  /** Whether hide in breadcrumbs, which are valid when the `page-header` component automatically generates breadcrumbs */
  hideInBreadcrumb?: boolean;
  /** ACL configuration, it's equivalent to `ACLService.can(roleOrAbility: ACLCanType)` parameter value */
  acl?: any;
  /** Whether shortcut menu item */
  shortcut?: boolean;
  /** Wheter shortcut menu root node */
  shortcutRoot?: boolean;
  /** Whether to allow reuse, need to cooperate with the `reuse-tab` component */
  reuse?: boolean;
  /** Whether to expand, when `checkStrictly` is valid in `sidebar-nav` component */
  open?: boolean;
  /** Unique identifier of the menu item, can be used in `getItem`,` setItem` to update a menu */
  key?: string;
  /** Children menu of menu item */
  children?: Menu[];
}
/**
 * Used for application startup
 * Generally used to get the basic data of the application, like: Menu Data, User Data, etc.
 */
@Injectable()
export class StartupService {
  constructor(
    iconSrv: NzIconService,
    public menuService: MenuService,
    private translate: TranslateService,
    @Inject(ALAIN_I18N_TOKEN) private i18n: I18NService,
    private settingService: SettingsService,
    private aclService: ACLService,
    private titleService: TitleService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    private httpClient: HttpClient,
    private injector: Injector,
    public http: _HttpClient,
  ) {
    iconSrv.addIcon(...ICONS_AUTO, ...ICONS);
  }

  private viaHttp(resolve: any, reject: any) {
    zip(
      this.httpClient.get(`assets/tmp/i18n/${this.i18n.defaultLang}.json`),
      this.httpClient.get('assets/tmp/app-data.json'),
    )
      .pipe(
        catchError(([langData, appData]) => {
          resolve(null);
          return [langData, appData];
        }),
      )
      .subscribe(
        ([langData, appData]) => {
          // Setting language data
          this.translate.setTranslation(this.i18n.defaultLang, langData);
          this.translate.setDefaultLang(this.i18n.defaultLang);
          // Application data
          const res: any = appData;
          // Application information: including site name, description, year
          this.settingService.setApp(res.app);
          // User information: including name, avatar, email address
          this.settingService.setUser(res.user);
          // ACL: Set the permissions to full, https://ng-alain.com/acl/getting-started
          this.aclService.setFull(true);
          // Menu data, https://ng-alain.com/theme/menu
          this.menuService.add(res.menu);
          // Can be set page suffix title, https://ng-alain.com/theme/title
          this.titleService.suffix = res.app.name;
        },
        () => {},
        () => {
          resolve(null);
        },
      );
  }

  private viaMockI18n(resolve: any, reject: any) {
    this.httpClient.get(`assets/tmp/i18n/${this.i18n.defaultLang}.json`).subscribe(langData => {
      this.translate.setTranslation(this.i18n.defaultLang, langData);
      this.translate.setDefaultLang(this.i18n.defaultLang);
      this.viaMock(resolve, reject);
      // this.require.getUserInfo();
      // this.getUserInfo();
    });
  }

  private viaMock(resolve: any, reject: any) {
    const tokenData = this.tokenService.get();
    if (!tokenData.token) {
      this.injector.get(Router).navigateByUrl('/passport/login');
      resolve({});
      return;
    }
    // mock
    const app: any = {
      name: `谛听`,
      description: `谛听物联网云平台`,
    };
    const user = this.settingService.user;
    // const user: any = {
    //   name: 'wangyong',
    //   avatar: './assets/tmp/img/avatar.jpg',
    //   email: 'wangyongbilly@163.com',
    //   token: '123456789',
    //   id: '4'
    // };
    // console.log(user);

    this.settingService.setUser(user);
    // Application information: including site name, description, year
    this.settingService.setApp(app);
    // ACL: Set the permissions to full, https://ng-alain.com/acl/getting-started
    this.aclService.setFull(true);
    // Menu data, https://ng-alain.com/theme/menu
    const MENU: Menu[] = [
      {
        group: false,
        text: '首页',
        link: '/home/dashboard',
        icon: { type: 'icon', value: 'home' },
        children: [
          {
            text: '主界面',
            link: '/home/dashboard',
            hideInBreadcrumb: true,
            icon: { type: 'icon', value: 'home' },
            shortcutRoot: true,
          },
          {
            text: '系统管理',
            hideInBreadcrumb: true,
            icon: { type: 'icon', value: 'setting' },
            // group: true,
            // target: '_self',
            children: [
              {
                text: '用户管理',
                link: '/home/system_manage/user_manage',
              },
              {
                text: '个人中心',
                hide: true,
                link: '/home/system_manage/user_center',
              },
              {
                text: '微信用户管理',
                link: '/home/system_manage/wxuser_manager',
              },
              {
                text: 'DTU默认配置',
                link: '/home/system_manage/dtu_default_config',
              },
              {
                text: '设备默认配置',
                link: '/home/system_manage/equip_default_config',
              },
              {
                text: 'DTU分配管理',
                link: '/home/system_manage/dtu_distribution',
              },
              {
                text: '密码修改',
                link: '/home/system_manage/password_form',
              },
            ],
            shortcutRoot: true,
          },
          {
            text: 'DTU管理',
            hideInBreadcrumb: true,
            icon: { type: 'icon', value: 'tool' },
            children: [
              {
                text: '在线DTU管理',
                link: '/home/dtu/dtu_manager',
              },
            ],
          },
          {
            text: '库文件',
            hideInBreadcrumb: true,
            icon: { type: 'icon', value: 'folder-open' },
            children: [
              {
                text: '文件管理',
                link: '/home/libary_file/bin_manager',
              },
              {
                text: '文件下发',
                link: '/home/libary_file/bin_send',
              },
            ],
          },
          {
            text: '报警管理',
            hideInBreadcrumb: true,
            icon: { type: 'icon', value: 'warning' },
            children: [
              {
                text: '报警处理',
                link: '/home/alarm/alarm_process',
              },
              {
                text: '报警历史',
                link: '/home/alarm/alarm_history',
              },
            ],
          },
          {
            text: '实时数据',
            link: '/home/realtime_manage',
            icon: { type: 'icon', value: 'sync' },
          },
          {
            text: '历史数据',
            link: '/home/data_query',
            icon: { type: 'icon', value: 'history' },
          },
          {
            text: '操作日志',
            link: '/home/operate_data',
            icon: { type: 'icon', value: 'line-chart' },
          },
          {
            key: 'newMenu',
            text: '用户自定义',
            hideInBreadcrumb: true,
            icon: { type: 'icon', value: 'line-chart' },
            children: [],
          },
        ],
      },
    ];

    const menu = this.settingService.user.menu;
    for (const i of menu) {
      MENU[0].children[8].children.push(i);
    }
    // console.log(MENU);
    this.menuService.add(MENU);
    // Can be set page suffix title, https://ng-alain.com/theme/title
    this.titleService.suffix = app.name;

    // this.menuService.setItem('newMenu', newMenu);
    // console.log(this.menuService.menus);
    // this.menuService.add(this.menuService.menus);
    resolve({});
  }

  public load(): Promise<any> {
    // only works with promises
    // https://github.com/angular/angular/issues/15088
    return new Promise((resolve, reject) => {
      // http
      // this.viaHttp(resolve, reject);
      // mock：请勿在生产环境中这么使用，viaMock 单纯只是为了模拟一些数据使脚手架一开始能正常运行
      this.viaMockI18n(resolve, reject);
    });
  }
}
