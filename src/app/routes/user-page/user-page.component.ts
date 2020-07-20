import { Component, OnInit, ElementRef, } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
// const html = require('../../test_html/index.js');
@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styles: []
})
export class UserPageComponent implements OnInit {
  iframe: SafeResourceUrl;
  constructor(public sanitizer: DomSanitizer, private el: ElementRef) { }

  ngOnInit() {
    // this.innerHTML = ``;
    const src = "https://www.baidu.com";
    this.iframe = this.sanitizer.bypassSecurityTrustResourceUrl(src);
    // const p = this.el.nativeElement.querySelector('#p');
    // console.log(p)
    // p.innerHTML = `<p>sdd</p>`
    // console.log(html)
  }

}
