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
import {ElementRef, Component, NgModule, ViewChild, ViewContainerRef, OnDestroy, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {fts} from '../../services/fts.service';
import {language} from '../../services/language.service';
import {navigation} from '../../services/navigation.service';
import {navigationtab} from '../../services/navigationtab.service';

declare var _: any;

@Component({
    selector: 'global-search',
    templateUrl: './src/globalcomponents/templates/globalsearch.html',
    providers: [fts]
})
export class GlobalSearch implements OnDestroy, OnInit {

    private searchScope: string = '*';
    private searchTimeOut: any = undefined;
    private searchTerm: string = '';
    private routeSubscription: any;

    constructor(private navigation: navigation, private navigationtab: navigationtab, private elementref: ElementRef, router: Router, private activatedRoute: ActivatedRoute, private fts: fts, private language: language) {

    }

    public ngOnInit(): void {
        this.routeSubscription = this.navigationtab.activeRoute$.subscribe(route => {
            const params = route.params;
            if (params.searchterm) {
                // try to base 64 decode .. but can also be plain string
                try {
                    this.searchTerm = atob(decodeURIComponent(params.searchterm));
                } catch (e) {
                    this.searchTerm = params.searchterm;
                }

                this.doSearch();
            } else {
                this.navigationtab.setTabInfo({displayname: 'global search', displayicon: 'search'});
            }
        });
    }

    public ngOnDestroy(): void {
        this.routeSubscription.unsubscribe();
    }

    private search(_e) {
        // handle the key pressed
        switch (_e.key) {
            case 'Enter':
                if (this.searchTimeOut) window.clearTimeout(this.searchTimeOut);
                this.fts.searchTerm = this.searchTerm;
                this.doSearch();
                break;
            default:
                if (this.searchTimeOut) window.clearTimeout(this.searchTimeOut);
                this.searchTimeOut = window.setTimeout(() => this.doSearch(), 1000);
                break;
        }
    }

    get totalcount() {
        let total = 0;
        for (let modres of this.fts.moduleSearchresults) {
            total += _.isNumber(modres.data.total) ? modres.data.total : modres.data.total.value;
        }
        return total;
    }

    get totalmodules() {
        let total = 0;
        for (let modres of this.fts.moduleSearchresults) {
            if ((_.isNumber(modres.data.total) ? modres.data.total : modres.data.total.value) > 0) total++;
        }
        return total;
    }

    /**
     * run the search
     */
    private doSearch(): void {
        if (this.searchScope === '*') {
            this.fts.searchByModules({searchterm: this.searchTerm}).subscribe(results => {
                let total = 0;
                for(let sres of this.fts.moduleSearchresults){
                    total += _.isNumber(sres.data.total) ? sres.data.total : sres.data.total.value;
                }
                this.setTabName(total);

            });
        } else {
            this.fts.searchByModules({searchterm: this.searchTerm, modules: [this.searchScope], size: 50}).subscribe(results => {
                let total = 0;
                for(let sres of this.fts.moduleSearchresults){
                    total += _.isNumber(sres.data.total) ? sres.data.total : sres.data.total.value;
                }
                this.setTabName(total);
            });
        }

        this.setTabName();
    }

    /**
     * sets the tabname
     */
    private setTabName(count?) {
        this.navigationtab.setTabInfo({displayname: 'search ' + this.searchTerm + (count ? ' (' + count + ')' : ''), displayicon: 'search'});
    }

    private getScopeClass(scope): string {
        if (scope === this.searchScope) {
            return 'slds-is-active';
        }
    }

    private setSearchScope(scope): void {
        if (scope === this.searchScope) return;

        this.searchScope = scope;
        this.doSearch();
    }

    private infiniteScroll(): boolean {
        if (this.searchScope === '*') {
            return false;
        } else {
            return true;
        }
    }
}
