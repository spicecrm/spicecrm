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


    constructor(private backend: backend, private session: session, private modelutilities: modelutilities) {
    }

    get hasSearchFilters() {
        return JSON.stringify({}) !== JSON.stringify(this.searchfilters);
    }

    public setSearchFocus(searchFocus) {
        this.searchfocus = searchFocus;
        let type = searchFocus.type == 'Product' ? 'products' : 'productgroups';
        this.getAttributes(type, searchFocus.object.id);
    }

    /*
    *  - type can be products or productgroups
    */
    public getAttributes(type, id) {
        this.loadingAttributes = true;
        this.groupAttributes = [];
        let params = {searchparams: true};

        this.backend.getRequest(`${type}/${id}/productattributes/direct`, params)
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

        this.backend.getRequest(`productvariants/${this.searchfocus.type.toLowerCase()}/${this.searchfocus.object.id}`, params)
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
            this.backend.getRequest(`productvariants/${this.searchfocus.type.toLowerCase()}/${this.searchfocus.object.id}`, params)
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
