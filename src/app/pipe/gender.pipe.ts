import { Pipe, PipeTransform } from '@angular/core';
const sexList = ['', '男', '女'];
@Pipe({
  name: 'gender'
})
export class GenderPipe implements PipeTransform {

  transform(value): any {
    if (!value) return value;
    return value == 1 ? "男" : "女";
  }

}
