import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { RequireService } from '@core/require';
// import Chinalocation from 'china-location';
// import list from 'china-location/dist/location.json'
import * as mapvgl from 'mapvgl'
// declare var BMapGL: any;
// declare var BMap: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less'],
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  constructor(private http: _HttpClient, private require: RequireService) { }
  /* global BMapGL */

  /* global mapv */

  /* global mapvgl */

  /* global initMap */

  /* global whiteStyle */

  /* global purpleStyle */
  ngOnInit(): void {
    // var bmapgl = new BMapGL.Map('map_container');
    // var point = new BMapGL.Point(116.403748, 39.915055);
    // bmapgl.centerAndZoom(point, 12);
    // bmapgl.enableScrollWheelZoom(true);
    // var view = new mapvgl.View({
    //   // effects: [new BMapGL.BloomEffect()],
    //   map: bmapgl,
    //   // mapType: 'cesium',
    // });
    // var layer = new mapvgl.FanLayer({
    //   color: 'rgba(50, 50, 200, 1)',
    //   radius: 100,
    //   data: [{
    //     geometry: {
    //       type: 'Point',
    //       coordinates: [116.392394, 39.910683]
    //     }
    //   }]
    // }
    // );
    // view.addLayer(layer);
  }

  ngAfterViewInit() {
  }

  ngOnDestroy(): void {

  }

}
