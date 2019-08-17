import { Component, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common'
import { DictionaryAPIService } from '../../shared/http/dictionary-api.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-main-search-component',
    templateUrl: './main-search.component.html',
    styleUrls: ['./main-search.component.css']
})

export class MainSearchComponent implements OnInit, OnDestroy {
    public searchTerm = '';
    public items: any[] = [];
    public count: number = 0;
    constructor(private dictionaryApiService: DictionaryAPIService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private location: Location) {

    }

    ngOnInit() {
        if (this.activatedRoute && this.activatedRoute.snapshot && this.activatedRoute.snapshot.data) {
            this.count = this.activatedRoute.snapshot.data.count || 0;
            this.items = this.activatedRoute.snapshot.data.items || [];
        }
        this.activatedRoute.params.subscribe((params) => {
            this.searchTerm = params.searchTerm || '';
        })
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
        this.location.go(`/${searchTerm}`);
        this.searchByTerm(searchTerm);
    }
}