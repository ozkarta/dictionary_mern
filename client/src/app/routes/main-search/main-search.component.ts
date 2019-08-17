import { Component, OnInit, OnDestroy } from '@angular/core';
import { DictionaryAPIService } from '../../shared/http/dictionary-api.service';

@Component({
    selector: 'app-main-search-component',
    templateUrl: './main-search.component.html',
    styleUrls: ['./main-search.component.css']
})

export class MainSearchComponent implements OnInit, OnDestroy {
    public searchTerm = '';
    public items: any[] = [];
    constructor(private dictionaryApiService: DictionaryAPIService) {

    }

    ngOnInit() {
        if (this.searchTerm) {
            this.searchByTerm(this.searchTerm);
        }        
    }

    ngOnDestroy() {

    }

    searchByTerm(term: string) {
        this.searchTerm = term;
        this.dictionaryApiService.searchByTerm(term)
            .subscribe(
                (success) => {
                    if (success) {
                        this.items = success.result || [];
                    }
                },
                (error) => {
                    console.log(error);
                    this.items = [];
                }
            )
    }

    searchTermChanged(searchTerm: string) {
        this.searchByTerm(searchTerm);
    }
}