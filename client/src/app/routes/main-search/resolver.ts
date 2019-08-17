import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { DictionaryAPIService } from '../../shared/http/dictionary-api.service';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()

export class DictionaryCountResolver implements Resolve<any> {
    constructor(private dictionaryApiService: DictionaryAPIService) { }

    resolve(route: ActivatedRouteSnapshot, rstate: RouterStateSnapshot): Observable<any> {
        return this.dictionaryApiService.getCount()
            .pipe(
                map(response => {
                    return response.count;
                }),
                catchError(error => {
                    console.log(error);
                    return of(0);
                })
            );
    }
}

export class DictionaryResolver implements Resolve<any> {
    constructor(private dictionaryApiService: DictionaryAPIService) { }

    resolve(route: ActivatedRouteSnapshot, rstate: RouterStateSnapshot): Observable<any> {
        return this.dictionaryApiService.searchByTerm(route.params.searchTerm || '')
            .pipe(
                map(response => {
                    return response.result;
                }),
                catchError(error => {
                    return of([]);
                })
            )
    }
}