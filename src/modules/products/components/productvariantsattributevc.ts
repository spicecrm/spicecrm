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
import {Component, ElementRef, Input, OnInit} from '@angular/core';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';
import {view} from '../../../services/view.service';

/**
 * handle managing the default attribute value
 */
@Component({
    selector: 'product-variants-attribute-vc',
    templateUrl: './src/modules/products/templates/productvariantsattributevc.html'
})
export class ProductVariantsAttributeVC implements OnInit {

    @Input() public attribute: any = {};
    public attributeValueId: any = undefined;

    constructor(public language: language, public backend: backend, public elementRef: ElementRef, public view: view, public model: model) {
    }

    get value() {
        return this.model.data.productattributevalues.beans[this.attributeValueId].pratvalue;
    }

    /**
     * set the attribute value
     * @param value
     */
    set value(value) {
        let attrValues = this.model.getField('productattributevalues');
        attrValues.beans[this.attributeValueId].pratvalue = value;
        this.model.setField('productattributevalues', attrValues);
    }

    /**
     * @return disabled if attribute in not usable
     */
    get isDisabled() {
        return this.attribute.attr_usage == 'none';
    }

    /**
     * @return view is editable
     */
    get editable() {
        return this.view.isEditable;
    }

    /**
     * @return view is edit mode
     */
    get isEditMode() {
        return this.view.isEditMode();
    }

    /**
     * set attribute value id
     */
    public ngOnInit() {
        this.setAttributeValueId();
    }

    /**
     * create the initial attribute value
     */
    private createInitialAttributeValue() {

        this.model.data.productattributevalues.beans[this.attributeValueId] = {
            id: this.attributeValueId,
            productattribute_id: this.attribute.id,
            pratvalue: '',
            parent_id: this.model.id,
            parent_type: this.model.module
        };
    }

    /**
     * set the attribute value id and clone the attribute value from
     */
    private setAttributeValueId() {

        const newId = this.model.generateGuid();
        const attrValues = this.model.data.productattributevalues;

        for (let id in attrValues.beans) {
            if (attrValues.beans.hasOwnProperty(id) && attrValues.beans[id].productattribute_id === this.attribute.id) {
                this.attributeValueId = id;
                break;
            }
        }
        if (!this.attributeValueId) {
            this.attributeValueId = newId;
            this.createInitialAttributeValue();
        }
    }
}
