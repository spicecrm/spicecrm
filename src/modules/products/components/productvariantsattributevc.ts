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
    templateUrl: '../templates/productvariantsattributevc.html'
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
    public createInitialAttributeValue() {

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
    public setAttributeValueId() {

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
