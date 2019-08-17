import { NgModule } from '@angular/core';

import { MainSearchComponent } from './main-search.component';
import { SharedModule } from '../../shared/shared.module';

import { MainSearchRoutingModule } from './main-search-routing.module';

import { SearchBoxComponent } from './search-box/search-box.component';
import { ResultBoxComponent } from './result-box/result-box.component';
import { WelcomeStatisticsComponent } from './welcome-statistics/welcome-statistics.component';
import { DictionaryCountResolver, DictionaryResolver } from './resolver';

@NgModule({
  imports: [
    SharedModule,
    MainSearchRoutingModule
  ],
  declarations: [
    MainSearchComponent,

    SearchBoxComponent,
    ResultBoxComponent,
    WelcomeStatisticsComponent,
  ],
  providers: [
    DictionaryCountResolver,
    DictionaryResolver
  ]
})
export class MainSearchModule { }
