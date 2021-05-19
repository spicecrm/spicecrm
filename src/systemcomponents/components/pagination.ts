/**
 * @module SystemComponents
 */
import {Component, EventEmitter, Input, OnChanges, Output, Pipe} from '@angular/core';
import {language} from "../../services/language.service";

@Component({
    selector: 'pagination-controls',
    templateUrl: './src/systemcomponents/templates/pagination.html'
})
export class PaginationControlsComponent implements OnChanges {

    @Input('page') private _page = 1;
    @Input() private limit = 1;
    @Input() private total_records = 0;
    @Input() private variation = 'default';
    @Output('pageChange') private page$ = new EventEmitter<number>(); // angular takes by default the Input value with a 'Change' Suffix when using two way binding: [(page)]
    @Output('leftPage') private oldPage$ = new EventEmitter<number>();
    private offset = 0;
    private max_page = 0;

    private get page() {
        return this._page;
    }

    private set page( val: number ) {
        console.log('page',this._page);
        if ( this._page === val ) return;
        this.oldPage$.emit(this._page);
        this._page = val;
        this.page$.emit(this._page);
    }

    public ngOnChanges() {
        // defaults...
        if( this.total_records > 0 ) {
            this.max_page = Math.ceil(this.total_records / this.limit);
        }
    }

    private pageUp() {
        if(this.page >= this.max_page) return false;
        this.page += 1;
    }

    private pageDown() {
        if(this.page <= 1) return false;
        this.page -= 1;
    }

}

// tslint:disable-next-line:max-classes-per-file
@Pipe({
    name: 'paginate',
    pure: false
})
export class PaginationPipe {

    public transform( collection: any[], args: any ): any[] {
        let start = (args.page-1) * args.limit;
        let end = start + args.limit;
        let slice = collection.slice(start, end);
        return slice;
    }

}
