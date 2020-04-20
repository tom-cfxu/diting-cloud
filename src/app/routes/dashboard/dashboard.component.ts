import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { RequireService } from '@core/require';
declare var BMap: any;
declare var BMapLib: any;
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less'],
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  constructor(public http: _HttpClient, private require: RequireService) {}
  // 创建地图实例
  map;
  point;
  // 创建MapVGL图层管理器
  view;
  data = [];
  dtuData = [];
  // 创建可视化图层
  layer;
  // 创建类聚合
  markerCluster;
  points = [];
  markers = [];
  // 判断是否数字
  isNumber(val) {
    // tslint:disable-next-line: prefer-const
    let regPos = /^\d+(\.\d+)?$/; // 非负浮点数
    // tslint:disable-next-line: prefer-const
    let regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; // 负浮点数
    if (regPos.test(val) || regNeg.test(val)) {
      return true;
    } else {
      return false;
    }
  }
  // 获取所有DTU
  getAllGateways() {
    const url = this.require.api.getAllGateways;
    this.require.post(url).subscribe((res: any) => {
      switch (res.code) {
        case '10005':
          // console.log(res.data.rows)
          if (res.data.rows.length > 0) {
            this.dtuData = res.data.rows.map(e => {
              return {
                gatewayNumber: e.gatewayNumber,
                provinceName: e.provinceName,
                cityName: e.cityName,
                areaName: e.areaName,
                detailLocate: e.detailLocate,
                locateX: e.locateX,
                locateY: e.locateY,
                status: e.status,
              };
            });
            this.data = res.data.rows.map(e => {
              return {
                geometry: {
                  type: 'POINT',
                  coordinates: [e.locateX, e.locateY],
                },
              };
            });
            this.showInfo(this.dtuData);
          }
          break;
        default:
          break;
      }
    });
  }
  // 设置信息窗口样式相关配置
  // tslint:disable-next-line: member-ordering
  opts = {
    width: 380, // 信息窗口宽度
    height: 220, // 信息窗口高度
    title: `<h1>DTU信息</h1>`, // 信息窗口标题
    enableMessage: false, // 设置允许信息窗发送短息
  };
  // 开启窗口信息
  openInfo(content, e) {
    // tslint:disable-next-line: prefer-const
    let p = e.target;
    // tslint:disable-next-line: prefer-const
    let point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
    // tslint:disable-next-line: prefer-const
    let infoWindow = new BMap.InfoWindow(content, this.opts); // 创建信息窗口对象
    this.map.openInfoWindow(infoWindow, point); // 开启信息窗口
  }
  // 监听标注点击
  addClickHandler(content, marker) {
    const that = this;
    // tslint:disable-next-line: only-arrow-functions
    marker.addEventListener('click', function(e) {
      that.openInfo(content, e);
    });
  }
  // 创建标注、类聚合、信息窗口,并添加到地图中
  showInfo(arr) {
    if (typeof arr === 'undefined') {
      return;
    }
    for (const data of arr) {
      if (this.isNumber(data.locateX) && this.isNumber(data.locateY)) {
        const point = new BMap.Point(data.locateX, data.locateY); // 创建坐标点
        const marker = new BMap.Marker(point); // 创建标注
        this.markers.push(marker);
        this.map.addOverlay(marker); // 将标注添加到地图中;
        // 窗口内容
        const content = `
          Dtu编号:${data.gatewayNumber}
          <br>省:${data.provinceName}
          <br>市:${data.cityName}
          <br>县:${data.areaName}
          <br>详细地址:${data.detailLocate}
          <br>经度:${data.locateX}
          <br>纬度:${data.locateY}
          <br>状态:${data.status}
          `;
        this.addClickHandler(content, marker); // 将信息窗口添加到地图
      }
    }
    this.markerCluster = new BMapLib.MarkerClusterer(this.map, { markers: this.markers }); // 添加类聚合
  }
  ngOnInit() {
    this.map = new BMap.Map('map_container');
    this.point = new BMap.Point(106.68, 33.58);
    this.map.centerAndZoom(this.point, 5);
    this.map.enableScrollWheelZoom(true);
    this.getAllGateways();
  }

  ngAfterViewInit() {}

  ngOnDestroy(): void {}
}
