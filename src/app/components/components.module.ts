import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { ServiceSelectComponent } from './service-select/service-select.component';
import { ServiceComponent } from './service/service.component';
import { RouterModule } from '@angular/router';
import { HistoryComponent } from './history/history.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { ServiceSignComponent } from './service-sign/service-sign.component';
import { AddSignComponent } from './add-sign/add-sign.component';


@NgModule({
  declarations: [
    HeaderComponent,
    ServiceSelectComponent,
    ServiceComponent,
    HistoryComponent,
    ServiceSignComponent,
    AddSignComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    PdfViewerModule
  ],
  exports: [
    HeaderComponent
  ]
})
export class ComponentsModule { }
