import { Component, Input } from '@angular/core';
@Component({
    selector: 'app-main-search-result-box',
    templateUrl: './result-box.component.html',
    styleUrls: ['./result-box.component.css']
})

export class ResultBoxComponent {
    @Input('items') items: any[];

    switchType(_type) {
        let type = _type;
        switch (_type) {
            case 'foreign':
                type = 'უცხო სიტყვათა ლექსიკონი'
                break;
            case 'civil':
                type = 'სამოქალაქო ლექსიკონი'
                break;
            case 'civil_education':
                type = 'სამოქალაქო განათლების ლექსიკონი'
                break;
            case 'universal_encyclopedia':
                type = 'უნივერსალური ენციკლოპედია'
                break;
            case 'botanic':
                type = 'ბოტანიკური ლექსიკონი'
                break;
            case 'geo-sulkhan-saba':
                type = 'სულხან-საბა: განმარტებითი ლექსიკონი'
                break;
            case 'metallurgy':
                type = 'მეტალურგიული ლექსიკონი'
                break;
            case 'library_terms':
                type = 'საბიბლიოთეკო ტერმინების ლექსიკონი'
                break;
            case 'maritime':
                type = 'საზღვაო ტერმინების ლექსიკონი'
                break;
            case 'medical':
                type = 'სამედიცინო ტერმინების ლექსიკონი'
                break;
            case 'grishashvili_tbilisuri':
                type = 'თბილისური ლექსიკონი'
                break;
            case 'geo_material_culture':
                type = 'ქართული მატერიალური კულტურის ლექსიკონი'
                break;
            case 'christianity':
                type = 'ქრისტიანული ლექსოკონი'
                break;
            // ===================
            case 'biology_scientific':
                type = 'ბიოლოგიური და სამედიცინო ტერმინები და ცნებები'
                break;

            case 'gurian':
                type = 'გურული ლექსიკონი'
                break;

            case 'upper_guria':
                type = 'ზემო გურული'
                break;

            case 'tvaladian':
                type = 'თვალადური ქართული ჭაშნიკი'
                break;

            case 'latin_justice':
                type = 'ლათინური იურიდიული ტერმინოლოგია'
                break;

            case 'megrelian':
                type = 'მეგრული ლექსიკონი'
                break;

            case 'qartlis_cxovrebis_topoarqeologiuri':
                type = 'ქართლის ცხოვრების ტოპოარქეოლოგიური ლექსიკონი'
                break;

            default: break;
        }
        return type;
    }
}