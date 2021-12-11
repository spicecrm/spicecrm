/**
 * @module ModuleProducts
 */
import {Injectable} from '@angular/core';
import {backend} from '../../../services/backend.service';
import {session} from '../../../services/session.service';
import {modelutilities} from '../../../services/modelutilities.service';

import {Subject, Observable} from 'rxjs';

/**
* @ignore
*/
declare var moment: any;

@Injectable()

export class productfinder {

    public groupAttributes: any[] = [];
    public productVariants: any[] = [];
    public productVariantAggregates: any = {};
    public loading: boolean = false;
    public loadingAttributes: boolean = false;
    public searchterm: string = '';
    public searchfilters: any = {};
    public searchtotal: number = 0;
    public searchfocus: any = {type: '', object: {}};


    constructor(public backend: backend, public session: session, public modelutilities: modelutilities) {
    }

    get hasSearchFilters() {
        return JSON.stringify({}) !== JSON.stringify(this.searchfilters);
    }

    public setSearchFocus(searchFocus) {
        this.searchfocus = searchFocus;
        let type = searchFocus.type == 'Product' ? 'Products' : 'ProductGroups';
        this.getAttributes(type, searchFocus.object.id);
    }

    /*
    *  - type can be products or productgroups
    */
    public getAttributes(type, id) {
        this.loadingAttributes = true;
        this.groupAttributes = [];
        let params = {searchparams: true};

        this.backend.getRequest(`module/${type}/${id}/ProductAttributes/direct`, params)
            .subscribe(attributes => {
                for (let attribute of attributes) {
                    this.groupAttributes.push(this.modelutilities.backendModel2spice('ProductAtrtibutes', attribute));
                }

                this.groupAttributes.sort((a, b) => {
                    return a.name > b.name ? 1 : -1;
                });

                this.getProductVariants();
                this.loadingAttributes = false;
            });
    }

    public getProductVariants() {

        if (this.loading) {
            return;
        }

        this.productVariants = [];
        this.loading = true;
        let params = {
            searchterm: this.searchterm,
            searchfilters: JSON.stringify(this.buildSearchFilters()),
            start: 0,
            size: 25
        };

        this.backend.getRequest(`module/ProductVariants/${this.searchfocus.type.toLowerCase()}/${this.searchfocus.object.id}`, params)
            .subscribe((variants: any) => {
                for (let variant of variants.variants) {
                    this.productVariants.push(this.modelutilities.backendModel2spice('ProductVariants', variant));
                }
                this.productVariantAggregates = variants.aggregates;
                this.loading = false;

                this.searchtotal = parseInt(variants.total, 10);
            });

    }

    public getMoreProductVariants() {

        if (!this.loading && this.searchtotal > this.productVariants.length) {
            this.loading = true;

            let params = {
                searchterm: this.searchterm,
                searchfilters: JSON.stringify(this.buildSearchFilters()),
                start: this.productVariants.length,
                size: 25
            };

            // fetch the variants
            this.backend.getRequest(`module/ProductVariants/${this.searchfocus.type.toLowerCase()}/${this.searchfocus.object.id}`, params)
                .subscribe((variants: any) => {
                    for (let variant of variants.variants) {
                        this.productVariants.push(this.modelutilities.backendModel2spice('ProductVariants', variant));
                    }
                    this.loading = false;
                    this.searchtotal = parseInt(variants.total, 10);
                });
        }
    }

    public resetSearchFilters() {
        if (this.hasSearchFilters) {
            this.searchfilters = {};
            this.getProductVariants();
        }
    }

    public getAggregateCount(aggregate, id) {
        let aggs = this.productVariantAggregates;
        return aggs && aggs[aggregate] && aggs[aggregate][id] ? aggs[aggregate][id] : '-';
    }

    public buildSearchFilters() {
        let filters = {};
        this.groupAttributes.forEach(attr => {
            if (this.searchfilters[attr.id]) {
                filters[attr.id] = {
                    datatype: attr.prat_datatype,
                    value: this.searchfilters[attr.id].value,
                    valuefrom: this.searchfilters[attr.id].valuefrom,
                    valueto: this.searchfilters[attr.id].valueto
                };
            }
        });
        return filters;
    }
}
