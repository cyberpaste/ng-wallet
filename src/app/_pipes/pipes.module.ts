import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';


import {TranslationPipe} from './translation.pipe';
import {UnixdateconverterPipe} from './unixdateconverter.pipe';


@NgModule({
  declarations: [
    TranslationPipe,
    UnixdateconverterPipe
  ],
  exports: [
    TranslationPipe,
    UnixdateconverterPipe
  ]
})
export class PipesModule {

}
