/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

/**
 * @module SystemComponents
 */
import {Component, EventEmitter, Input, OnChanges, Output, Pipe} from '@angular/core';

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
    @Input() private canSwitch = true;
    private offset = 0;
    private max_page = 0;

    private get page() {
        return this._page;
    }

    private set page( val: number ) {
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

    private pageUp() {
        if( !this.canSwitch || this.page >= this.max_page ) return false;
        this.page += 1;
    }

    private pageDown() {
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
