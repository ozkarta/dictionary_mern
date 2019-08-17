import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

const routes = [
    {
        path: '',
        canActivate: [],
        children: [
            {
                path: '',
                loadChildren: './routes/main-search/main-search.module#MainSearchModule'
            },
        ]
    },
    {
        path: '**',
        loadChildren: './routes/main-search/main-search.module#MainSearchModule'
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
    declarations: [],
    exports: [RouterModule],
    providers: []
})
export class AppRoutingModule { }