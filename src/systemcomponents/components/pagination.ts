/**
 * @module SystemComponents
 */
import {Component, EventEmitter, Input, OnChanges, Output, Pipe} from '@angular/core';

@Component({
    selector: 'pagination-controls',
    templateUrl: '../templates/pagination.html'
})
export class PaginationControlsComponent implements OnChanges {

    @Input('page') public _page = 1;
    @Input() public limit = 1;
    @Input() public total_records = 0;
    @Input() public variation = 'default';
    @Output('pageChange') public page$ = new EventEmitter<number>(); // angular takes by default the Input value with a 'Change' Suffix when using two way binding: [(page)]
    @Output('leftPage') public oldPage$ = new EventEmitter<number>();
    @Input() public canSwitch = true;
    public offset = 0;
    public max_page = 0;

    public get page() {
        return this._page;
    }

    public set page( val: number ) {
        if ( this._page === val ) return;
        this.oldPage$.emit(this._page);
        this._page = val;
        this.page$.emit(this._page);
    }

    public ngOnChanges() {
        // defaults...
        if( this.total_records > 0 ) {
            this.max_page = Math.ceil(this.total_records / this.limit);
        } else this.max_page = 0;
    }

    public pageUp() {
        if( !this.canSwitch || this.page >= this.max_page ) return false;
        this.page += 1;
    }

    public pageDown() {
        if( !this.canSwitch || this.page <= 1 ) return false;
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
