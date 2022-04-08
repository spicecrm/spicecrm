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
    templateUrl: '../templates/groupwareemailarchivepanesearch.html'
})
export class GroupwareEmailArchivePaneSearch {
    /**
     * Input string used for searching.
     */
    public searchTerm: string = "";

    /**
     * A list of found beans.
     */
    public beans: any[] = [];

    /**
     * A boolean used to indicate if a search is currently running.
     */
    public searching: boolean = false;

    /**
     * a timeout to react to the users input and only search after a specific time passed
     */
    public searchTimeOut: any = undefined;

    /**
     * the current sleected search module
     */
    public _searchmodule: string = 'all';

    /**
     * a random generated id to break automcomplete on the serach fields
     */
    public autocompleteid: string = _.uniqueId();

    constructor(
        public backend: backend,
        public language: language,
        public metadata: metadata,
        public groupware: GroupwareService,
        public fts: fts
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
    public search(_e) {
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
    public searchSpice() {
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
