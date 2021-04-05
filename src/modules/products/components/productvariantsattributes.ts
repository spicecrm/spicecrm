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
import {Component, OnDestroy} from '@angular/core';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {Subscription} from "rxjs";
import {backend} from "../../../services/backend.service";

/**
 * display and manage the group attributes
 */
@Component({
    selector: 'product-variants-attributes',
    templateUrl: './src/modules/products/templates/productvariantsattributes.html'
})
export class ProductVariantsAttributes implements OnDestroy {
    /***
     * holds the group attributes
     */
    public attributes: any[] = [];
    /**
     * holds the parent id
     */
    private parentId: string = '';
    /**
     * holds the loading boolean
     */
    private isLoading: boolean = false;
    /**
     * subscription to unsubscribe on destroy
     */
    private subscription: Subscription = new Subscription();

    constructor(private language: language, private model: model, private backend: backend) {
        this.subscription = this.model.data$.subscribe(data => {
            this.loadAttributes(data);
        });
    }

    /**
     * unsubscribe from subscriptions
     */
    public ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    /**
     * call to load the attributes
     */
    public ngOnInit() {
        this.loadAttributes(this.model.data);
        this.loadAttributeValues();
    }

    /**
     * load the attributes from backend
     * @param data
     */
    private loadAttributes(data) {
        let parentField;
        let type;
        switch (this.model.module) {
            case 'ProductVariants':
                parentField = 'product_id';
                type = 'products';
                break;
            case 'Products':
                parentField = 'productgroup_id';
                type = 'productgroups';
                break;
        }

        const parentFieldId = data[parentField];
        if (!!parentFieldId && parentFieldId != this.parentId) {
            this.isLoading = true;
            this.parentId = parentFieldId;
            this.backend.getRequest(`${type}/${parentFieldId}/productattributes/direct`)
                .subscribe(attributes => {
                    this.attributes = attributes.sort((a, b) => +a.sort_sequence > +b.sort_sequence ? 1 : -1);
                    this.isLoading = false;
                }, err => this.isLoading = false);
        } else if (!parentFieldId) {
            this.parentId = '';
            this.attributes = [];
        }
    }

    /**
     * load the attribute values
     */
    private loadAttributeValues() {
        if (!this.model.data.productattributevalues) {
            this.model.data.productattributevalues = {beans: {}};
        }
    }
}
