import {Injectable} from '@angular/core';
import {backend} from '../../../services/backend.service';
import {session} from '../../../services/session.service';
import {modelutilities} from '../../../services/modelutilities.service';

@Injectable()

export class productfinder {

    public groupAttributes: any = {};
    public productVariants: any = {};
    public productVariantAggregates: any = {};
    public loading: boolean = false;
    public loadingAttributes: boolean = false;
    public searchterm: string = '';
    public searchfilters: any = {};
    public searchtotal: number = 0;
    public searchfocus: any = {type: '', object: {}};


    constructor(private backend: backend, private session: session, private modelutilities: modelutilities) {
    }

    get hasSearchFilters() {
        return JSON.stringify({}) !== JSON.stringify(this.searchfilters);
    }

    get selectedProductVariants() {
        return this.productVariants[this.searchfocus.object.id] || [];
    }

    get selectedGroupAttributes() {
        return this.groupAttributes[this.searchfocus.object.id] || [];
    }

    public setSearchFocus(searchFocus) {
        this.searchfocus = searchFocus;
        let type = searchFocus.type == 'Product' ? 'products' : 'productgroups';
        this.getAttributes(type, searchFocus.object.id, true);
    }

    /*
    *  - type can be products or productgroups
    */
    public getAttributes(type, id, searchonly = false) {
        if (this.groupAttributes[id]) {
            return;
        }
        this.loadingAttributes = true;
        this.groupAttributes[id] = [];
        let params = {searchparams: searchonly};

        this.backend.getRequest(`${type}/${id}/productattributes/direct`, params)
            .subscribe(attributes => {
                for (let attribute of attributes) {
                    this.groupAttributes[id].push(this.modelutilities.backendModel2spice('ProductAtrtibutes', attribute));
                }

                this.groupAttributes[id].sort((a, b) => {
                    return a.name > b.name ? 1 : -1;
                });

                this.getProductVariants();
                this.loadingAttributes = false;
            });
    }

    public getProductVariants() {
        let objId = this.searchfocus.object.id;
        if (this.loading || this.productVariants[objId]) {
            return;
        }

        this.productVariants[objId] = [];
        this.loading = true;
        let params = {
            searchterm: this.searchterm,
            searchfilters: JSON.stringify(this.buildSearchFilters()),
            start: 0,
            size: 25
        };

        this.backend.getRequest(`productvariants/${this.searchfocus.type.toLowerCase()}/${objId}`, params)
            .subscribe((variants: any) => {
                for (let variant of variants.variants) {
                    this.productVariants[objId].push(this.modelutilities.backendModel2spice('ProductVariants', variant));
                }
                this.productVariantAggregates[objId] = variants.aggregates;
                this.loading = false;

                this.searchtotal = parseInt(variants.total, 10);
            });

    }

    public getMoreProductVariants() {
        let objId = this.searchfocus.object.id;

        if (!this.loading && this.searchtotal > this.productVariants[objId].length) {
            this.loading = true;

            let params = {
                searchterm: this.searchterm,
                searchfilters: JSON.stringify(this.buildSearchFilters()),
                start: this.productVariants[objId].length,
                size: 25
            };

            // fetch the variants
            this.backend.getRequest(`productvariants/${this.searchfocus.type.toLowerCase()}/${this.searchfocus.object.id}`, params)
                .subscribe((variants: any) => {
                    for (let variant of variants.variants) {
                        this.productVariants[objId].push(this.modelutilities.backendModel2spice('ProductVariants', variant));
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
        return aggs[id] && aggs[id][aggregate] && aggs[id][aggregate][id] ? aggs[id][aggregate][id] : '-';
    }

    public buildSearchFilters() {
        let filters = {};
        for (let prop in this.groupAttributes) {
            if (this.groupAttributes.hasOwnProperty(prop)) {
                this.groupAttributes[prop].forEach(attr => {
                    if (this.searchfilters[attr.id]) {
                        filters[attr.id] = {
                            datatype: attr.prat_datatype,
                            value: this.searchfilters[attr.id].value,
                            valuefrom: this.searchfilters[attr.id].valuefrom,
                            valueto: this.searchfilters[attr.id].valueto
                        };
                    }
                });
            }
        }
        return filters;
    }
}
