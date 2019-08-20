import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'unixdateconverter'
})
export class UnixdateconverterPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return new Date(value * 1000).toUTCString();
  }


}
