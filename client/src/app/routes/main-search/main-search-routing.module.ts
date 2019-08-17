import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DictionaryCountResolver, DictionaryResolver } from './resolver'
import { MainSearchComponent } from './main-search.component';

const routes: Routes = [
  {
    path: ':searchTerm',
    pathMatch: 'full',
    component: MainSearchComponent,
    resolve: {
        count: DictionaryCountResolver,
        items: DictionaryResolver
    }
  },
  {
    path: '',
    pathMatch: 'full',
    component: MainSearchComponent,
    resolve: {
        count: DictionaryCountResolver
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainSearchRoutingModule { }
