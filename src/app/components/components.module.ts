import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { ServiceSelectComponent } from './service-select/service-select.component';



@NgModule({
  declarations: [
    HeaderComponent,
    ServiceSelectComponent
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    HeaderComponent
  ]
})
export class ComponentsModule { }
