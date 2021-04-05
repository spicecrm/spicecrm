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

@Injectable()
export class fts {

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
    private lastSearchParams: any = {};

    public gloablSearchResults: any = {};

    constructor(
        private backend: backend,
        private configurationService: configurationService,
        private session: session,
        private modelutilities: modelutilities,
        private metadata: metadata,
    ) {
        this.getSearchModules();
    }


    get loadedSearchModules() {
        return this.searchModules.filter(module => this.metadata.checkModuleAcl(module, 'list'));
    }

    private transformHits(hits) {
        let retArray = [];
        for (let hit of hits) {
            retArray.push(this.tranformHit(hit));
        }
        return retArray;
    }

    private tranformHit(hit) {
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

        this.runningsearch = this.backend.postRequest('search', {}, {
            size,
            searchterm,
            modules: this.loadedSearchModules.join(',')
        }).subscribe((response) => {
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
        }).subscribe(response => {
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
        }).subscribe(response => {
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
        }).subscribe(response => {
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
        this.searchModules = this.metadata.getGlobalSearchModules();

        /*
        this.backend.getRequest('fts/searchmodules')
            .subscribe((response: any) => {
                for (let module of response.modules) {
                    if (this.metadata.checkModuleAcl(module, 'list')) {
                        this.searchModules.push(module);
                    }
                }
            });
         */
    }

    public resetData() {
        this.found = 0;
        this.hits = [];
    }
}
