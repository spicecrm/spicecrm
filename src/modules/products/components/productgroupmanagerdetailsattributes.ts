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
import {Component, OnDestroy, OnInit, ViewChild, ViewChildren, ViewContainerRef} from '@angular/core';
import {language} from '../../../services/language.service';
import {metadata} from "../../../services/metadata.service";
import {backend} from "../../../services/backend.service";
import {model} from "../../../services/model.service";
import {Subscription} from "rxjs";
import {relatedmodels} from "../../../services/relatedmodels.service";
import {broadcast} from "../../../services/broadcast.service";
import {productfinder} from "../services/productfinder.service";

@Component({
    selector: 'product-group-manager-details-attributes',
    templateUrl: './src/modules/products/templates/productgroupmanagerdetailsattributes.html',
    providers: [relatedmodels]
})
export class ProductGroupManagerDetailsAttributes implements OnInit, OnDestroy {

    public fields: any[] = [];
    public attributes: any[] = [];
    public filterKeyword: string = '';
    @ViewChild('buttoncontainer', {read: ViewContainerRef, static: true}) private buttonContainer: ViewContainerRef;
    @ViewChild('itemcontainer', {read: ViewContainerRef, static: true}) private itemContainer: ViewContainerRef;
    private allExpanded: boolean = false;
    private isLoading: boolean = true;
    private modelSubscription: Subscription = new Subscription();

    constructor(private language: language,
                private backend: backend,
                private metadata: metadata,
                private productFinder: productfinder,
                private broadcast: broadcast,
                private relatedmodels: relatedmodels,
                private model: model) {
        this.relatedmodels.module = this.model.module;
        this.relatedmodels.id = this.model.id;
        this.relatedmodels.relatedModule = 'ProductAttributes';
        this.saveSubscriber();
    }

    get filteredAttributes() {
        return this.attributes.filter(attr => this.filterKeyword.length == 0 || attr.summary_text.toLowerCase().includes(this.filterKeyword.toLowerCase()));
    }

    get canAdd() {
        return this.metadata.checkModuleAcl(this.model.module, "create");
    }

    public ngOnInit() {
        this.backend.getRequest(`productgroups/${this.model.id}/productattributes/direct`).subscribe(res => {
            this.attributes = this.sortAttributes(res) || [];
            this.isLoading = false;
        }, err => this.isLoading = false);
    }

    public ngOnDestroy() {
        this.modelSubscription.unsubscribe();
    }

    private trackByFn(index, item) {
        return item.id;
    }

    private sortAttributes(array) {
        return array.sort((a, b) => {
            return +a.sort_sequence > +b.sort_sequence ? 1 : -1;
        });
    }

    private saveSubscriber() {
        this.modelSubscription = this.broadcast.message$.subscribe(msg => {
            let resData = msg.messagedata;
            if (resData.module == 'ProductAttributes' && msg.messagetype == 'model.save') {
                this.attributes.some((attr, i) => attr.id == resData.id ? this.attributes[i] = resData.data : false);
                this.attributes = this.sortAttributes(this.attributes);
            }
        });
    }

    private handleAddEvent(item) {
        item.parent_name = this.productFinder.searchfocus.object.id != this.model.id ? this.model.data.summary_text : '';
        item.parent_id = this.model.id;
        this.attributes = [...this.attributes, item];
        this.attributes = this.sortAttributes(this.attributes);
        this.relatedmodels.addItems([item]);
    }
}
