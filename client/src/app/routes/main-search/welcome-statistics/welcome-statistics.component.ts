import { Component, Input } from '@angular/core';
import { count } from 'rxjs/operators';

@Component({
    selector: 'app-main-search-welcole-statistics',
    templateUrl: './welcome-statistics.component.html',
    styleUrls: ['./welcome-statistics.component.css']
})

export class WelcomeStatisticsComponent {
    @Input('count') count;

    getRoundedCount(count = 0) {
        return Math.floor(count / 1000) * 1000;
    }
}