import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

const API_URL = environment.apiServer;
declare var gtag: any;

@Injectable()
export class DictionaryAPIService {

  constructor(private http: HttpClient) { }

  public searchByTerm(term): Observable<any> {
    setTimeout(() => {
      gtag('js', new Date());
      gtag('config', 'UA-145836201-1', {'page_path': `/${term}`});
    }, 0);
    return this.http.get<any>(`${API_URL}/api/v1/dictionary?searchTerm=${term}`);
  }

  public getCount(): Observable<any> {
    return this.http.get<any>(`${API_URL}/api/v1/dictionary/count`);
  }

}