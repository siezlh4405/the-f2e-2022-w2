import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { ServiceSelectComponent } from './service-select/service-select.component';
import { ServiceComponent } from './service/service.component';
import { RouterModule } from '@angular/router';
import { HistoryComponent } from './history/history.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';


@NgModule({
  declarations: [
    HeaderComponent,
    ServiceSelectComponent,
    ServiceComponent,
    HistoryComponent
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
