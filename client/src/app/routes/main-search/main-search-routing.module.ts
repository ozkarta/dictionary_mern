import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainSearchComponent } from './main-search.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: MainSearchComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainSearchRoutingModule { }
