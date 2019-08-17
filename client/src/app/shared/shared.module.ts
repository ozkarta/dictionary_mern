import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

// API Services
import { DictionaryAPIService } from './http/dictionary-api.service'

// Services


@NgModule({
  declarations: [
  ],
  imports: [
    RouterModule,
    HttpClientModule
  ],
  exports: [
    RouterModule,
    HttpClientModule
  ],
  providers: [
    // API SERVICES
    DictionaryAPIService,
    // Services
  ]
})
export class SharedModule { }
