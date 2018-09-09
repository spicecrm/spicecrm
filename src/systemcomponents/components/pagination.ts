import {Component, EventEmitter, Input, OnInit, Output, Pipe} from '@angular/core';
import {language} from "../../services/language.service";

@Component({
    selector: 'pagination-controls',
    templateUrl: './src/systemcomponents/templates/pagination.html'
})
export class PaginationControlsComponent implements OnInit
{
    @Input('page') private _page = 1;
    @Input() limit = 1;
    @Input() total_records = 0;
    @Input() variation = 'default';
    // angular takes by default the Input value with a 'Change' Suffix when using two way binding: [(page)]
    @Output('pageChange') page$ = new EventEmitter<number>();
    offset = 0;
    max_page = 0;

    constructor(
        private language: language
    ){

    }

    get page()
    {
        return this._page;
    }

    set page(val:number)
    {
        this._page = val;
        this.page$.emit(this._page);
    }

    ngOnInit()
    {
        // defaults...
        if(this.total_records > 0)
        {
            this.max_page = Math.ceil(this.total_records / this.limit);
        }
    }

    pageUp()
    {
        if(this.page >= this.max_page)
            return false;

        this.page += 1;
    }

    pageDown()
    {
        if(this.page <= 1)
            return false;

        this.page -= 1;
    }
}



@Pipe({
    name: 'paginate',
    pure: false
})
export class PaginationPipe
{
    public transform(collection: any[], args: any): any[]
    {
        let start = (args.page-1) * args.limit;
        let end = start + args.limit;
        let slice = collection.slice(start, end);
        //console.log(start, end, args);
        return slice;
    }
}