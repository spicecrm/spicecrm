import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";

import {configurationService} from './configuration.service';
import {session} from './session.service';
import {modelutilities} from './modelutilities.service';
import {backend} from './backend.service';
import {metadata} from './metadata.service';
import {Router} from '@angular/router';
import {Observable, Subject} from 'rxjs';

@Injectable()
export class fts {

    public hits: any[] = [];
    public found: number = 0;
    public runningsearch: any = undefined;
    public runningmodulesearch: any = undefined;
    public searchTerm: string = '';
    public searchSort: any = {};
    public searchAggregates: any = {};
    public searchModules: any[] = [];
    public moduleSearchresults: any[] = [];
    private lastSearchParams: any = {};

    public gloablSearchResults: any = {};

    constructor(
        private backend: backend,
        private http: HttpClient,
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

    public searchByModules(searchterm: string, modules: string[] = [], size: number = 10, aggregates = {}, sortparams: any = {}, owner = false, modulefilter = '') {
        let retSubject = new Subject<any>();
        // if no module is passed .. search all modules
        if (modules.length === 0) {
            modules = this.loadedSearchModules;
        }

        if (searchterm.indexOf('%') != -1) {
            searchterm = searchterm.replace(/%/g, '*');
        }
        searchterm = searchterm.trim();
        // set the searchterm
        this.searchTerm = searchterm;
        this.searchAggregates = aggregates;
        this.searchSort = sortparams;


        // todo: check if same search is done .. and then do nothing .. avoid too many calls

        // if we have a running search cancel it ...
        if (this.runningmodulesearch) {
            this.runningmodulesearch.unsubscribe();
        }

        this.runningmodulesearch = this.backend.postRequest('search', {}, {
            modules: modules.length > 0 ? modules.join(',') : '',
            searchterm,
            records: size,
            owner,
            aggregates: this.searchAggregates,
            sort: this.searchSort,
            modulefilter
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
                return y.data.max_score - x.data.max_score;
            })

            // set the last parameters
            this.lastSearchParams = {
                modules,
                searchterm,
                size
            };
            this.runningmodulesearch = undefined;

            retSubject.next(response);
            retSubject.complete();

        });

        return retSubject.asObservable();
    }

    public loadMore() {
        let retSubject = new Subject<any>();
        // if we are in a serch ... do nothing
        if (this.runningmodulesearch) {
            return;
        }

        if (this.moduleSearchresults[0].data.hits.length >= this.moduleSearchresults[0].data.total) {
            return;
        }

        this.runningmodulesearch = this.backend.postRequest('search', {}, {
            modules: this.lastSearchParams.modules.length > 0 ? this.lastSearchParams.modules.join(',') : '',
            searchterm: this.lastSearchParams.searchterm,
            aggregates: this.searchAggregates,
            sort: this.searchSort,
            records: this.lastSearchParams.size,
            start: this.moduleSearchresults[0].data.hits.length
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
        this.backend.getRequest('fts/searchmodules')
            .subscribe((response: any) => {
                for (let module of response.modules) {
                    if (this.metadata.checkModuleAcl(module, 'list')) {
                        this.searchModules.push(module);
                    }
                }
            });
    }

    public resetData() {
        this.found = 0;
        this.hits = [];
    }
}
