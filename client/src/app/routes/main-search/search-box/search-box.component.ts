import { Component, ViewChild, AfterViewInit, OnInit, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { map, filter, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { fromEvent, Observable, of } from 'rxjs';


@Component({
    selector: 'app-main-search-search-box',
    templateUrl: './search-box.component.html',
    styleUrls: ['./search-box.component.css']
})

export class SearchBoxComponent implements AfterViewInit {
    @Input('searchTerm') searchTerm: string;
    @Output('searchTermChanged') searchTermChanged: EventEmitter<any> = new EventEmitter();
    public typeahead: Observable<any> = null;
    @ViewChild('termInput', {static: false}) termInput: ElementRef;

    constructor() {
    }

    ngAfterViewInit() {
        this.initTypeahead();
        this.subscribeTypeahead();
    }

    initTypeahead() {
        if (!this.termInput) return;
        this.typeahead = fromEvent(this.termInput.nativeElement, 'input').pipe(
            map((e: Event) => {
                return e.target['value'] || '';
            }),
            // filter(text => text.length > 2),
            debounceTime(500),
            distinctUntilChanged(),
            switchMap(term => {
                this.searchTermChanged.emit(term);
                if (!term) return of('');
                return term;
            })
        );
    }

    subscribeTypeahead() {
        if (!this.typeahead) return;
        this.typeahead.subscribe()
    }
}