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
 * @module ModuleGroupware
 */
import {AfterViewInit, Component, OnInit} from '@angular/core';

import {backend} from "../../../services/backend.service";
import {language} from "../../../services/language.service";
import {fts} from "../../../services/fts.service";
import {metadata} from "../../../services/metadata.service";
import {GroupwareService} from '../../../include/groupware/services/groupware.service';

declare var _: any;

/**
 * Search component. Returns a list of beans found using the search terms.
 */
@Component({
    selector: 'groupware-email-archive-pane-search',
    templateUrl: './src/include/groupware/templates/groupwareemailarchivepanesearch.html'
})
export class GroupwareEmailArchivePaneSearch {
    /**
     * Input string used for searching.
     */
    private searchTerm: string = "";

    /**
     * A list of found beans.
     */
    private beans: any[] = [];

    /**
     * A boolean used to indicate if a search is currently running.
     */
    private searching: boolean = false;

    /**
     * a timeout to react to the users input and only search after a specific time passed
     */
    private searchTimeOut: any = undefined;

    /**
     * the current sleected search module
     */
    private _searchmodule: string = 'all';

    /**
     * a random generated id to break automcomplete on the serach fields
     */
    private autocompleteid: string = _.uniqueId();

    constructor(
        private backend: backend,
        private language: language,
        private metadata: metadata,
        private groupware: GroupwareService,
        private fts: fts
    ) {
    }

    /**
     * select/deselect all attachments based on the checkbox boolean value
     * @param val
     */
    set selectAll(val) {
        if (val) {
            this.groupware.archiveto = this.beans.slice();
        } else {
            this.groupware.archiveto = [];
        }
    }

    /**
     * @return true if all attachments are selected
     */
    get selectAll() {
        return this.groupware.archiveto.length > 0 && this.groupware.archiveto.length == this.beans.length;
    }

    /**
     * returns the name of the search module
     */
    get searchmodule() {
        return this.language.getModuleName(this._searchmodule);
    }

    /**
     * sets the search module
     *
     * @param module
     */
    set searchmodule(module) {
        this._searchmodule = module;
        if (this.searchTerm) {
            this.searchSpice();
        }
    }

    /**
     * returns the title fo the module
     */
    get moduleTitle() {
        if (this._searchmodule == 'all') {
            return this.language.getLabel('LBL_ALL');
        } else {
            return this.searchmodule;
        }
    }


    /**
     * looks up for all fts modules if any with a link to email is available
     */
    get searchmodules() {
        let searchmodules = [];
        let allSearchModules = this.fts.searchModules;
        for (let searchModule of allSearchModules) {
            let fields = this.metadata.getModuleFields(searchModule);
            for (let field in fields) {
                // ToDo cleanup backend so module is set properly here ... firty workaropund to also check fieldname emails
                if (fields[field].type == 'link' && (field == 'emails' || fields[field].module == 'Emails')) {
                    searchmodules.push(searchModule);
                    break;
                }
            }
        }

        // sort the modules
        searchmodules.sort((a, b) => this.language.getModuleName(a) > this.language.getModuleName(b) ? 1 : -1);

        return searchmodules;
    }

    /**
     * Handles the keyboard input into the search field.
     * @param _e
     */
    private search(_e) {
        // handle the key pressed
        switch (_e.key) {
            case 'ArrowDown':
            case 'ArrowUp':
                break;
            case 'Enter':
                if (this.searchTerm.length) {
                    // if we wait for completion kill the timeout
                    if (this.searchTimeOut) window.clearTimeout(this.searchTimeOut);
                    this.searchSpice();
                }
                break;
            default:
                if (this.searchTimeOut) window.clearTimeout(this.searchTimeOut);
                this.searchTimeOut = window.setTimeout(() => this.searchSpice(), 1000);
                break;
        }
    }

    /**
     * Performs the search in SpiceCRM.
     */
    private searchSpice() {
        // set to searching is true
        this.searching = true;

        // reset the search results
        this.beans = [];

        // build the searchmodules
        let searchmodules = [];
        if (this._searchmodule != 'all') {
            searchmodules.push(this._searchmodule);
        } else {
            searchmodules = this.searchmodules;
        }

        this.fts.searchByModules({searchterm: this.searchTerm, modules: searchmodules, size: 10}).subscribe(rsults => {
            let hits = [];
            for (let moduleSearchresult of this.fts.moduleSearchresults) {
                hits = hits.concat(moduleSearchresult.data.hits);
            }
            hits.sort((a, b) => {
                return a._score > b._score ? -1 : 1;
            });

            for(let hit of hits){
                this.beans.push({
                    id: hit._id,
                    module: hit._source._module ? hit._source._module : hit._type,
                    data: hit._source
                });
            }

            // set to no longer searching
            this.searching = false;
        });
    }
}
