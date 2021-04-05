/*
SpiceUI 2021.01.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

/**
 * @module GlobalComponents
 */
import {
    Component,
    Input,
    Output,
    EventEmitter
} from '@angular/core';
import {Router} from '@angular/router';
import {language} from '../../services/language.service';
import {fts} from '../../services/fts.service';

@Component({
    selector: 'global-header-search-results-items',
    templateUrl: './src/globalcomponents/templates/globalheadersearchresultsitems.html'
})
export class GlobalHeaderSearchResultsItems {
    @Input() private searchTerm: string = '';
    @Input() private searchModule: string = '';
    @Input() private searchResults: any[] = [];
    @Output() private selected: EventEmitter<any> = new EventEmitter<any>();

    constructor(private router: Router, private language: language, private fts: fts) {

    }

    get searchModuleName() {
        return this.language.getLabel('LBL_INSPICECRM');
    }

    private goSearch() {
        // navigate tot he search view
        if (this.searchTerm.length > 0) {
            this.selected.emit(true);
            this.router.navigate(['/search/' + btoa(this.searchTerm)]);
        }
    }
}
