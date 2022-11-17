import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ServiceSelectComponent } from './components/service-select/service-select.component';
import { ServiceComponent } from './components/service/service.component';

const routes: Routes = [
  { path: '', component: ServiceSelectComponent },
  { path: 'sign', component: ServiceComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
