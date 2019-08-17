import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

const API_URL = environment.apiServer;

@Injectable()
export class DictionaryAPIService {

  constructor(private http: HttpClient) { }

  public searchByTerm(term): Observable<any> {
    return this.http.get<any>(`${API_URL}/api/v1/dictionary?searchTerm=${term}`);
  }

  public getCount(): Observable<any> {
    return this.http.get<any>(`${API_URL}/api/v1/dictionary/count`);
  }

}