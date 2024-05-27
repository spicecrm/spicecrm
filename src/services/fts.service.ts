/**
 * @module services
 */
import {Injectable} from '@angular/core';
import {configurationService} from './configuration.service';
import {session} from './session.service';
import {modelutilities} from './modelutilities.service';
import {backend} from './backend.service';
import {metadata} from './metadata.service';
import {Subject} from 'rxjs';
import {language} from "./language.service";


interface ftsSearchBuckets {
    bucketfield: string;
    bucketitems: any[];
    aggregatefield?: string;
    aggregatefunction?: 'SUM' | 'COUNT';
}

interface ftsSearchParameters {
    searchterm?: string;
    searchgeo?: any;
    modules?: string[];
    size?: number;
    aggregates?: any;
    sortparams?: any;
    owner?: boolean;
    modulefilter?: any;
    buckets?: ftsSearchBuckets;
}

@Injectable({
    providedIn: 'root'
})
export class fts {
    /**
     * reference id will be sent with each backend request to enable canceling the pending requests
     */
    public httpRequestsRefID: string = window._.uniqueId('fts_http_ref_');

    public hits: any[] = [];
    public found: number = 0;
    public runningsearch: any = undefined;
    public runningmodulesearch: any = undefined;
    public searchTerm: string = '';
    public searchSort: any = {};
    public searchOwner: boolean = false;
    public searchGeo: any = {};
    public searchAggregates: any = {};
    public searchModules: any[] = [];
    public modulefilter: string = '';

    /**
     * bucket paramater for the search with buckets
     */
    public buckets: any = {};

    public moduleSearchresults: any[] = [];
    public lastSearchParams: any = {};

    public gloablSearchResults: any = {};

    constructor(
        public backend: backend,
        public configurationService: configurationService,
        public session: session,
        public modelutilities: modelutilities,
        public metadata: metadata,
        private language: language
    ) {
        this.getSearchModules();
    }


    get loadedSearchModules() {
        return this.searchModules.filter(module => this.metadata.checkModuleAcl(module, 'list'));
    }

    /**
     * check for search term errors
     * @param searchTerm
     */
    public checkForSearchTermErrors(searchTerm): {label: string, nestedValues: string[]}[] | undefined {
        let config = this.configurationService.getCapabilityConfig('search');
        let minNgram = config.min_ngram ? parseInt(config.min_ngram, 10) : 3;
        let items = searchTerm.split(' ');
        const errors = [];

        if (items.filter(i => i !== 'OR' && i.length < minNgram).length > 0) {
            errors.push({
                label: 'MSG_SEARCH_TERM_TOO_SHORT',
                nestedValues: [String(minNgram)]
            });
        }

        return errors.length == 0 ? undefined : errors;
    }

    public transformHits(hits) {
        let retArray = [];
        for (let hit of hits) {
            retArray.push(this.tranformHit(hit));
        }
        return retArray;
    }

    public tranformHit(hit) {
        // transform the fields
        for (let field in hit._source) {
            if (hit._source.hasOwnProperty(field) && typeof (hit._source[field]) == 'string') {
                // bugfix S&P gets translated later on anyway .. no need to do this here
                // hit._source[field] = this.modelutilities.backend2spice(hit._type, field, hit._source[field])
                hit._source[field] = hit._source[field];
            }
        }
        return hit;
    }

    public search(searchterm, size: number = 5) {

        // set the searchterm
        this.searchTerm = searchterm;

        // if we have a running search cancel it ...
        if (this.runningsearch) {
            this.runningsearch.unsubscribe();
        }

        this.resetData();

        const requestID = this.httpRequestsRefID + '_search';

        this.backend.cancelPendingRequests([requestID]);

        this.runningsearch = this.backend.postRequest('search', {}, {
            size,
            searchterm,
            modules: this.loadedSearchModules.join(',')
        }, requestID).subscribe((response) => {
            this.hits = response.hits.hits;
            this.found = response.hits.total;
            this.runningsearch = undefined;
        });
    }

    // public searchByModules(searchterm: string, modules: string[] = [], size: number = 10, aggregates = {}, sortparams: any = {}, owner = false, modulefilter = '') {
    public searchByModules(parameters: ftsSearchParameters) {
        let retSubject = new Subject<any>();
        // if no module is passed .. search all modules
        if (!parameters.modules || parameters.modules.length === 0) {
            parameters.modules = this.loadedSearchModules;
        }

        if (parameters.searchterm && parameters.searchterm.indexOf('%') != -1) {
            parameters.searchterm = parameters.searchterm.replace(/%/g, '*');
        }
        parameters.searchterm = parameters.searchterm.trim();
        // set the searchterm
        this.searchTerm = parameters.searchterm;
        this.searchAggregates = parameters.aggregates;
        this.searchSort = parameters.sortparams;
        this.searchGeo = parameters.searchgeo;
        this.searchOwner = parameters.owner;
        this.modulefilter = parameters.modulefilter;
        this.buckets = parameters.buckets;


        // todo: check if same search is done .. and then do nothing .. avoid too many calls

        // if we have a running search cancel it ...
        if (this.runningmodulesearch) {
            this.runningmodulesearch.unsubscribe();
        }

        const requestID = this.httpRequestsRefID + '_search_by_modules';

        this.backend.cancelPendingRequests([requestID]);
        
        this.runningmodulesearch = this.backend.postRequest('search', {}, {
            modules: parameters.modules.length > 0 ? parameters.modules.join(',') : '',
            searchterm: parameters.searchterm,
            searchgeo: parameters.searchgeo,
            records: parameters.size,
            owner: parameters.owner,
            aggregates: this.searchAggregates,
            sort: this.searchSort,
            modulefilter: parameters.modulefilter,
            buckets: parameters.buckets
        }, requestID).subscribe(response => {
            // var response = res.json();
            this.moduleSearchresults = [];

            for (let module in response) {
                if (response.hasOwnProperty(module)) {
                    this.moduleSearchresults.push({
                        module,
                        data: {
                            hits: this.transformHits(response[module].hits),
                            max_score: response[module].max_score,
                            total: response[module].total
                        }
                    });
                }
            }

            // sort by releveance
            this.moduleSearchresults.sort((x, y) => {
                let xf = parseFloat(x.data.max_score);
                let yf = parseFloat(y.data.max_score);
                if(isNaN(xf) && isNaN(yf)) return 1;
                if(isNaN(yf)) return -1;
                if(isNaN(xf)) return 1;
                return yf > xf ? 1 : -1;
            });

            // set the last parameters
            this.lastSearchParams = parameters;

            this.runningmodulesearch = undefined;

            retSubject.next(response);
            retSubject.complete();

        });

        return retSubject.asObservable();
    }

    public export(searchterm: string, module: string, fields: string[], aggregates = {}, sortparams: any = {}, owner = false,) {
        let retSubject = new Subject<any>();

        if (searchterm.indexOf('%') != -1) {
            searchterm = searchterm.replace(/%/g, '*');
        }
        searchterm = searchterm.trim();
        // set the searchterm
        this.searchTerm = searchterm;
        this.searchAggregates = aggregates;
        this.searchSort = sortparams;

        this.runningmodulesearch = this.backend.getDownloadPostRequestFile('search/export', {}, {
            module,
            searchterm,
            fields,
            owner,
            aggregates,
            sort: this.searchSort,
        }, this.httpRequestsRefID).subscribe(response => {
            retSubject.next(response);
            retSubject.complete();
        });

        return retSubject.asObservable();
    }

    public loadMore(buckets?) {
        let retSubject = new Subject<any>();
        // if we are in a serch ... do nothing
        if (this.runningmodulesearch) {
            return;
        }

        if (buckets) {
            // check per bucket
            let canLoadMore = false;
            for(let bucketitem of buckets.bucketitems) {
                if(!bucketitem.total || bucketitem.total > bucketitem.items){
                    canLoadMore = true;
                }
            }
            if(!canLoadMore) return;
        } else {
            if (this.moduleSearchresults[0].data.hits.length >= this.moduleSearchresults[0].data.total) {
                return;
            }
        }


        this.runningmodulesearch = this.backend.postRequest('search', {}, {
            modules: this.lastSearchParams.modules.length > 0 ? this.lastSearchParams.modules.join(',') : '',
            searchterm: this.lastSearchParams.searchterm,
            aggregates: this.searchAggregates,
            sort: this.searchSort,
            owner: this.searchOwner,
            records: this.lastSearchParams.size,
            start: this.moduleSearchresults[0].data.hits.length,
            modulefilter: this.modulefilter,
            buckets: buckets
        }, this.httpRequestsRefID).subscribe(response => {
            // var response = res.json();
            for (let module of this.lastSearchParams.modules) {
                for (let hit of response[module].hits) {
                    this.moduleSearchresults[0].data.hits.push(this.tranformHit(hit));
                }
            }
            this.runningmodulesearch = undefined;

            retSubject.next(response);
            retSubject.complete();
        });
        return retSubject.asObservable();
    }

    public getSearchModules() {
        this.searchModules = this.metadata.getGlobalSearchModules().sort((a,b) => this.language.getModuleName(a).localeCompare(this.language.getModuleName(b)));

    }

    public resetData() {
        this.found = 0;
        this.hits = [];
    }
}
