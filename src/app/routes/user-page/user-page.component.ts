import { Component, OnInit, ElementRef, } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { UploadFile } from 'ng-zorro-antd';
import { RequireService } from '@core/require';
import { HttpHeaders } from '@angular/common/http';
// const html = require('../../test_html/index.js');
@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styles: [`
  .list{
    display:flex;
    justify-content:space-between
  }
    .delete-btn{
      // position:absolute;
      text-align:right;
      color:red
    }
    .iframe{
      border:none
    }
  `]
})
export class UserPageComponent implements OnInit {
  iframe: SafeResourceUrl;
  uploading = false;
  //节点
  htmls = [];
  domhtml = [];
  tabs = [];
  index = 0;
  // 手动上传配置
  fileList: UploadFile[] = [];
  beforeUpload = (file: UploadFile): boolean => {
    this.fileList = [];
    this.fileList = this.fileList.concat(file);
    return false;
  };
  constructor(public sanitizer: DomSanitizer, private el: ElementRef, private request: RequireService) { }
  //关闭标签页
  closeTab(tab: string): void {
    this.tabs.splice(this.tabs.indexOf(tab), 1);
  }
  //上传网页
  sumbit() {
    this.uploading = true
    const url = this.request.api.uploadHtml2;
    const formData = new FormData();
    this.fileList.forEach((file: any) => {
      formData.append('file', file);
    });
    formData.append('token', this.request.tokenService.get().token);
    const header: HttpHeaders = new HttpHeaders();
    header.set('Content-Type', 'multipart/form-data');
    try {
      this.request.http.post(url, formData, null, { headers: header }).subscribe((res) => {
        this.uploading = false;
        this.fileList = [];
        this.getHtmlName();
      }, (err) => {
        this.uploading = false;
        // this.request.message.warning('上传失败!')
        this.fileList = [];
      })
    } catch (err) {
      this.uploading = false;
      console.log(err)
    }
    this.uploading = false
  }
  //删除网页
  deleteHtml(item) {
    const url = this.request.api.deleteHtmlFile2;
    const body = `filename=${item}`
    this.request.post(url, body).subscribe((res: any) => {
      this.getHtmlName();
      this.closeTab(item);
    })
  }
  //渲染网页
  RenderDOM(html, i = 0) {
    let dom = this.el.nativeElement.querySelector(`#html${i}`);
    if (dom != null) {
      const container = new DOMParser().parseFromString(html, 'text/html');
      let div = container.querySelector('html');
      console.log(div);
      // dom. = div;
      dom.innerHTML = "";
      dom.appendChild(div);
    }

    // console.log(dom)
  }
  //加载iframe
  iframeDOM(url, i = 0) {
    let dom = this.el.nativeElement.querySelector(`#html${i}`);
    if (dom != null) {
      dom.innerHTML = `
        <iframe marginWidth=0 marginHeight=0 scrolling="auto" frameBorder=0 width="100%" class="iframe"
            src="${url}" height="600px">
        </iframe>
      `
    }
  }
  //下载网页html,加到dom中
  download(item) {
    const url = this.request.api.getHtmlContent2;
    const body = `filename=${item}`
    let isRepeat = false;
    this.tabs.forEach((tab, i) => {
      if (tab == item) {
        // console.log(i)
        this.index = i;
        isRepeat = true
      }
    });
    if (!isRepeat) {
      this.request.post(url, body).subscribe((res: any) => {
        if (res.data != null) {
          if (!isRepeat) {
            let promise = new Promise((reslove, reject) => {
              this.tabs.push(item);
              this.index = this.tabs.length - 1;
              reslove('成功')
            })
            promise.then((reslove) => {
              setTimeout(() => {
                this.RenderDOM(res.data, this.index)
              }, 500)

            })
          }

        }
      })
    }
  }
  //获取网页url,加载到iframe
  getHtmlUrl(item) {
    const url = this.request.api.getHtmlUrl;
    const body = `filename=${item}`
    let isRepeat = false;
    this.tabs.forEach((tab, i) => {
      if (tab == item) {
        // console.log(i)
        this.index = i;
        isRepeat = true;
      }
    });
    if (!isRepeat) {
      this.request.post(url, body).subscribe((res: any) => {
        if (res.data != null) {
          let promise = new Promise((reslove, reject) => {
            this.tabs.push(item);
            this.index = this.tabs.length - 1;
            reslove('成功')
          })
          promise.then((reslove) => {
            setTimeout(() => {
              this.iframeDOM(res.data.url, this.index)
            }, 500)
          })

        }
      })
    }
  }
  //获取网页名
  getHtmlName() {
    const url = this.request.api.getHtmlNames;
    // const body = `filename=index4.html`
    this.request.post(url).subscribe((res: any) => {
      this.htmls = res.data
      if (res.data.length == 0) {
        this.RenderDOM('')
      }

    })
  }
  ngOnInit() {
    this.getHtmlName();
  }

}
