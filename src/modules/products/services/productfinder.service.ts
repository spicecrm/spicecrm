import {Injectable} from '@angular/core';
import {backend} from '../../../services/backend.service';
import {session} from '../../../services/session.service';
import {modelutilities} from '../../../services/modelutilities.service';

import {Subject, Observable} from 'rxjs';

declare var moment: any;

@Injectable()
export class productfinder {

    productvariants: Array<any> = [];
    productvariantaggregates: any = {}
    loading: boolean = false;
    loadingattributes: boolean = false;
    groupattributes: Array<any> = [];
    searchterm: string = '';
    searchfocus: any = {
        type: '',
        object: {}
    };
    searchfilters: any = {};
    searchtotal: number = 0;


    constructor(private backend: backend, private session: session, private modelutilities: modelutilities) {
    }

    hasSearchFilters(){
        return JSON.stringify({}) !== JSON.stringify(this.searchfilters);
    }

    resetSearchFilters(){
        if(this.hasSearchFilters()) {
            this.searchfilters = {};
            this.getProductVariants();
        }
    }

    getProductVariants() {
        // if we are in a loading cycle do nothing
        if (this.loading) return;

        // reset the array
        this.productvariants = [];
        this.loading = true;

        let params = {
            searchterm: this.searchterm,
            searchfilters: JSON.stringify(this.buildSearchFilters()),
            start: 0,
            size: 25
        };

        // fetch the variants
        this.backend.getRequest('productvariants/' + this.searchfocus.type.toLowerCase() + '/' + this.searchfocus.object.id, params).subscribe((variants : any) => {
            for (let variant of variants.variants) {
                this.productvariants.push(this.modelutilities.backendModel2spice('ProductVariants', variant));
            }
            this.productvariantaggregates = variants.aggregates;
            this.loading = false;

            this.searchtotal = parseInt(variants.total);
        })

    }

    getMoreProductVariants() {
        if(!this.loading && this.searchtotal > this.productvariants.length){
            this.loading = true;

            let params = {
                searchterm: this.searchterm,
                searchfilters: JSON.stringify(this.buildSearchFilters()),
                start: this.productvariants.length,
                size: 25
            };

            // fetch the variants
            this.backend.getRequest('productvariants/' + this.searchfocus.type.toLowerCase() + '/' + this.searchfocus.object.id, params).subscribe((variants : any) => {
                for (let variant of variants.variants) {
                    this.productvariants.push(this.modelutilities.backendModel2spice('ProductVariants', variant));
                }
                this.loading = false;

                this.searchtotal = parseInt(variants.total);
            })
        }
    }

    getAggegateCount(aggregate, id){
        try{
            return this.productvariantaggregates[aggregate][id];
        } catch(e){
            return '-'
        }
    }

    /*
    * get the attributes
    *  - type can be products or productgroups
    *  -  id is the id of the entry
    *
     */
    getAttributes(type, id, searchonly = false) : Observable <boolean>  {
        let responseSubject = new Subject<boolean>();

        this.groupattributes = [];
        this.loadingattributes = true;

        this.backend.getRequest(type + '/' + id + '/productattributes/direct', {searchparams: searchonly}).subscribe(attributes => {
            for (let attribute of attributes) {
                this.groupattributes.push(this.modelutilities.backendModel2spice('ProductAtrtibutes', attribute));
            }

            // sort by name
            this.groupattributes.sort((a, b) => {
                return a.name > b.name ? 1 : -1;
            });

            responseSubject.next(true);
            responseSubject.complete();
            this.loadingattributes = false;
        })

        return responseSubject.asObservable();
    }

    buildSearchFilters(){
        let filters = {};
        for(let attribute of this.groupattributes){
            if(this.searchfilters[attribute.id]){
                filters[attribute.id] = {
                    datatype: attribute.prat_datatype,
                    value: this.searchfilters[attribute.id].value,
                    valuefrom: this.searchfilters[attribute.id].valuefrom,
                    valueto: this.searchfilters[attribute.id].valueto
                }
            }
        }
        return filters;
    }
}
