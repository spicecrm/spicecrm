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
 * @module ModuleSpiceMap
 */
import {ChangeDetectionStrategy, Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {language} from '../../../services/language.service';
import {metadata} from "../../../services/metadata.service";
import {modellist} from "../../../services/modellist.service";
import {Subscription} from "rxjs";

/**
 * renders list header with search and other list functionalities.
 */
@Component({
    selector: 'spice-google-maps-list-header',
    templateUrl: './src/include/spicemap/templates/spicegooglemapslistheader.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpiceGoogleMapsListHeader implements OnInit, OnDestroy {
    /**
     * the search term entered
     */
    public searchTerm: string = '';

    /**
     * the search term used in the search before
     */
    public searchTermOld: string = '';

    /**
     * a search timeout function to wait until the user stops typing with a certain delay and onyl then start the search
     */
    public searchTimeOut: any = undefined;


    private subscriptions: Subscription = new Subscription();

    /**
     * emits the used search term
     */
    @Output() private usedSearchTerm: EventEmitter<string> = new EventEmitter<string>();

    constructor(public language: language, public modellist: modellist, public metadata: metadata, public element: ElementRef) {
    }

    /**
     * a getter that builds teh request fields from the listfields from the modellistservice
     */
    get requestfields() {
        let requestfields = [];
        for (let listfield of this.modellist.listfields) {
            if (requestfields.indexOf(listfield.field) != -1) {
                requestfields.push(listfield.field);
            }
        }
        return requestfields;
    }

    get relateFilter() {
        return this.modellist.relatefilter;
    }

    /**
     * returns the relate filter active flag
     */
    get relateFilterActive() {
        return this.relateFilter?.active;
    }

    /**
     * sets the relate filter active flag and triggers a reload
     *
     * @param value
     */
    set relateFilterActive(value) {
        this.relateFilter.active = value;
        this.modellist.relatefilter.active = value;
        this.modellist.reLoadList();
    }


    /**
     * loads the modellist and sets the various paramaters
     */
    public ngOnInit() {
        this.searchTerm = this.modellist.searchTerm;
        this.searchTermOld = this.modellist.searchTerm;
    }

    /**
     * unsubscribe from teh list type change
     */
    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    /**
     * tigger the search
     */
    private doSearch() {
        this.searchTermOld = this.searchTerm;
        this.modellist.searchTerm = this.searchTerm;
        this.modellist.getListData(this.requestfields);
    }

    /**
     * trigger the search immediate or with a delay
     *
     * @param _e
     */
    private triggerSearch(_e) {
        if (this.searchTerm === this.searchTermOld) return;
        // handle the key pressed
        switch (_e.key) {
            case 'Enter':
                if (this.searchTerm.length > 0) {
                    if (this.searchTimeOut) window.clearTimeout(this.searchTimeOut);
                    this.doSearch();
                }
                break;
            default:
                if (this.searchTimeOut) window.clearTimeout(this.searchTimeOut);
                this.searchTimeOut = window.setTimeout(() => this.doSearch(), 1000);
                break;
        }
    }
}
