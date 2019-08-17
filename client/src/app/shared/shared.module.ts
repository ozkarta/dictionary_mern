import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// API Services
import { DictionaryAPIService } from './http/dictionary-api.service'

// Services


@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule,
    FormsModule
  ],
  exports: [
    RouterModule,
    HttpClientModule,
    CommonModule,
    FormsModule
  ],
  providers: [
    // API SERVICES
    DictionaryAPIService,
    // Services
  ]
})
export class SharedModule { }
