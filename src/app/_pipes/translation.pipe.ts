import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../environments/environment';

import { En } from '../_translations';

@Pipe({
  name: 'translation'
})
export class TranslationPipe implements PipeTransform {

  private language: {};

  transform(value: any, args?: any): any {
    switch (environment.language) {
      case 'En': this.language = En;
    }
    if (this.language && value) {
      const splitted = value.split('.', 3);

      let langArray = this.language;
      splitted.forEach((item) => {
        if (langArray[item] !== undefined) {
          langArray = langArray[item];
        } else {
          langArray = value;
        }
      });
      return langArray;
    }

    return null;
  }

}
