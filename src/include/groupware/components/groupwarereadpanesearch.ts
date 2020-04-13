/**
 * @module ModuleGroupware
 */
import {AfterViewInit, Component, OnInit} from '@angular/core';

import {backend} from "../../../services/backend.service";
import {language} from "../../../services/language.service";
import {fts} from "../../../services/fts.service";
import {metadata} from "../../../services/metadata.service";

declare var _: any;

/**
 * Search component. Returns a list of beans found using the search terms.
 */
@Component({
    selector: 'groupware-read-pane-search',
    templateUrl: './src/include/groupware/templates/groupwarereadpanesearch.html'
})
export class GroupwareReadPaneSearch {
    /**
     * Input string used for searching.
     */
    private searchTerm: string = "";

    /**
     * A list of found beans.
     */
    private searchResults: any[] = [];
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
        private fts: fts
    ) {
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
        this.searchResults = [];

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
            this.searchResults = hits;

            // set to no longer searching
            this.searching = false;
        });
    }
}
