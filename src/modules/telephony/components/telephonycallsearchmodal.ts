/**
 * @module ModuleTelephony
 */
import {Component, EventEmitter, Input, OnInit, Output, SkipSelf} from '@angular/core';

import {metadata} from "../../../services/metadata.service";
import {fts} from "../../../services/fts.service";
import {configurationService} from "../../../services/configuration.service";

/**
 * renders a modal to search for any phone related beans
 */
@Component({
    selector: 'telephony-call-panel-search-modal',
    templateUrl: './src/modules/telephony/templates/telephonycallsearchmodal.html'
})
export class TelephonyCallSearchModal implements OnInit {

    /**
     * the reference to the modal itself
     * @private
     */
    private self: any;

    /**
     * the timeout to react to the search field
     *
     * @private
     */
    private searchTimeOut: any = undefined;

    /**
     * the searchterm
     * @private
     */
    private searchTerm: string = '';

    /**
     * a trimmed version of the serachterm to cater fortrailing and leading whitespaces
     * @private
     */
    private searchTermUntrimmed: string = '';

    /**
     * the returned results
     *
     * @private
     */
    private searchresults: any[] = [];

    /**
     * the modules to search in
     *
     * @private
     */
    private searchmodules: string[] = [];

    /**
     * indicates that we are searching
     *
     * @private
     */
    private searching: boolean = false;

    /**
     * an event emitter when a record is selected
     *
     * @private
     */
    @Output() private selected: EventEmitter<any> = new EventEmitter<any>();

    constructor(
        private metadata: metadata,
        private fts: fts,
        private configuration: configurationService
    ) {

    }

    public ngOnInit() {
        this.searchmodules = this.metadata.getPhoneSearchModules();
    }

    public select(selected, model) {
        this.selected.emit(model)
        this.close();
    }

    private doSearch() {
        this.searchTerm = this.searchTermUntrimmed.trim();
        if (this.searchTerm.length && this.searchTerm !== this.fts.searchTerm) {
            // start the search
            this.executeSearch();
        }
    }

    private executeSearch() {

        this.searchresults = [];
        this.searching = true;
        this.fts.searchByModules({searchterm: this.searchTerm, modules: this.searchmodules, size: 25}).subscribe(rsults => {
            let hits = [];
            for (let moduleSearchresult of this.fts.moduleSearchresults) {
                hits = hits.concat(moduleSearchresult.data.hits);
            }
            hits.sort((a, b) => {
                return a._score > b._score ? -1 : 1;
            });
            this.searching = false;
            this.searchresults = hits;
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
        // handle the key pressed
        switch (_e.key) {
            case 'Enter':
                this.searchTerm = this.searchTermUntrimmed.trim();
                if (this.searchTerm.length && this.searchTermsValid(this.searchTerm)) {
                    // if we wait for completion kill the timeout
                    if (this.searchTimeOut) window.clearTimeout(this.searchTimeOut);
                    this.doSearch()
                }
                break;
            default:
                if (this.searchTimeOut) window.clearTimeout(this.searchTimeOut);
                if (this.searchTermsValid(this.searchTermUntrimmed.trim())) {
                    this.searchTimeOut = window.setTimeout(() => this.doSearch(), 1000);
                } else if (this.searchTermUntrimmed.trim() == '') {
                    this.searchTerm = '';
                    this.searchresults = [];
                }
                break;
        }
    }


    /**
     * checks if we have the proper length of searchterms
     *
     * @param searchTerm
     * @private
     */
    private searchTermsValid(searchTerm) {
        let config = this.configuration.getCapabilityConfig('search');
        let minNgram = config.min_ngram ? parseInt(config.min_ngram, 10) : 3;
        let maxNgram = config.max_ngram ? parseInt(config.max_ngram, 10) : 20;
        let items = searchTerm.split(' ');
        return items.filter(i => i.length < minNgram || i.length > maxNgram).length == 0;
    }

    public close() {
        this.self.destroy();
    }

}
