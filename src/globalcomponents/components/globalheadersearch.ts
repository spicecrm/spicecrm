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
    ElementRef,
    Renderer2
} from '@angular/core';
import {Router} from '@angular/router';
import {fts} from '../../services/fts.service';
import {language} from '../../services/language.service';
import {broadcast} from '../../services/broadcast.service';

@Component({
    selector: 'global-header-search',
    templateUrl: './src/globalcomponents/templates/globalheadersearch.html',
    providers: [fts]
})
export class GlobalHeaderSearch {
    private showRecent: boolean = false;
    private searchTimeOut: any = undefined;
    private searchTerm: string = '';
    private searchTermUntrimmed: string = '';
    private clickListener: any;
    public _searchmodule: string = 'all';
    private searchresults: any[] = [];


    get searchmodule() {
        // return this.language.getModuleName(this._searchmodule);
        return this._searchmodule;
    }

    set searchmodule(module) {
        this._searchmodule = module;
        if (this.searchTerm && this.showRecent) {
            this.executeSearch();
        }
    }

    constructor(public router: Router, public broadcast: broadcast, public fts: fts, public elementRef: ElementRef, public renderer: Renderer2, public language: language) {
    }

    get showModuleSelector() {
        return window.innerWidth >= 768;
    }

    private onFocus() {
        this.showRecent = true;
        this.clickListener = this.renderer.listen('document', 'click', (event) => this.onClick(event));
    }

    private closePopup() {
        this.clickListener();
        this.showRecent = false;
        this.searchTerm = '';
        this.searchTermUntrimmed = '';
    }

    private doSearch() {
        this.searchTerm = this.searchTermUntrimmed.trim();
        if (this.searchTerm.length && this.searchTerm !== this.fts.searchTerm) {
            // start the search
            this.executeSearch();
        }
    }

    private executeSearch() {
        let searchmodules = [];
        if (this.showModuleSelector && this._searchmodule != 'all') searchmodules.push(this._searchmodule);

        this.searchresults = [];
        this.fts.searchByModules({searchterm: this.searchTerm, modules: searchmodules, size: 10}).subscribe(rsults => {
            let hits = [];
            for (let moduleSearchresult of this.fts.moduleSearchresults) {
                hits = hits.concat(moduleSearchresult.data.hits);
            }
            hits.sort((a, b) => {
                return a._score > b._score ? -1 : 1;
            });
            this.searchresults = hits.splice(0, 10);
        });

        // broadcast so if searc is open also the serach is updated
        // this.broadcast.broadcastMessage('fts.search', this.searchTerm);
    }

    private clearSearchTerm() {
        // cancel any ongoing search
        if (this.searchTimeOut) window.clearTimeout(this.searchTimeOut);

        // clear the serachterm
        this.searchTerm = '';
        this.searchTermUntrimmed = '';
        this.fts.searchTerm = '';
    }

    private search(_e) {
        // make sur ethe popup is open
        this.showRecent = true;

        // handle the key pressed
        switch (_e.key) {
            case 'ArrowDown':
            case 'ArrowUp':
                break;
            case 'Enter':
                this.searchTerm = this.searchTermUntrimmed.trim();
                if (this.searchTerm.length) {
                    // if we wait for completion kill the timeout
                    if (this.searchTimeOut) window.clearTimeout(this.searchTimeOut);

                    // close the dropdown
                    this.showRecent = false;

                    // navigate tot he search view
                    if (this.searchTerm.length > 0) {
                        this.router.navigate(['/search/' + btoa(this.searchTerm)]);
                    }
                }
                break;
            default:
                if (this.searchTimeOut) window.clearTimeout(this.searchTimeOut);
                this.searchTimeOut = window.setTimeout(() => this.doSearch(), 1000);
                break;
        }
    }

    public onClick(event: MouseEvent): void {
        const clickedInside = this.elementRef.nativeElement.contains(event.target);
        if (!clickedInside) {
            this.closePopup();
        }
    }

    private selected(event) {
        this.showRecent = false;
        this.clearSearchTerm();
    }
}
