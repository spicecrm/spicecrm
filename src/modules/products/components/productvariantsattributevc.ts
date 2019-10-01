/**
 * @module ModuleProducts
 */
import {Component, ElementRef, Input, OnInit} from '@angular/core';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';
import {view} from '../../../services/view.service';


/**
 * @ignore
 */

@Component({
    selector: 'product-variants-attribute-vc',
    templateUrl: './src/modules/products/templates/productvariantsattributevc.html'
})
export class ProductVariantsAttributeVC implements OnInit {

    @Input() public attribute: any = {};
    public attrbutevalueset: any = undefined;

    constructor(public language: language, public backend: backend, public elementRef: ElementRef, public view: view, public model: model) {
    }

    get value() {
        return this.attrbutevalueset.pratvalue;
    }

    set value(value) {
        let attrValues = this.model.getField('productattributevalues');
        for (let id in attrValues.beans) {
            if (attrValues.beans.hasOwnProperty(id) && attrValues.beans[id].productattribute_id === this.attribute.id) {
                attrValues.beans[id].pratvalue = value;
                this.attrbutevalueset.pratvalue = value;
                break;
            }
        }
        this.model.setField('productattributevalues', attrValues);
    }

    get isDisabled() {
        return this.attribute.attr_usage == 'none';
    }

    get editable() {
        return this.view.isEditable;
    }

    get editmode() {
        return this.view.isEditMode();
    }

    public ngOnInit() {
        this.setAttributeValueSet();
    }

    public createAttributeValueSet() {
        let guid = this.model.generateGuid();
        this.model.data.productattributevalues.beans[guid] = {
            id: guid,
            productattribute_id: this.attribute.id,
            pratvalue: this.model.isNew ? this.attribute.value : '',
            parent_id: this.model.id,
            parent_type: this.model.module
        };
        this.attrbutevalueset = this.model.data.productattributevalues.beans[guid];
    }

    private setAttributeValueSet() {
        let attrValues = this.model.data.productattributevalues;
        if (attrValues) {
            for (let id in attrValues.beans) {
                if (attrValues.beans.hasOwnProperty(id) && attrValues.beans[id].productattribute_id === this.attribute.id) {
                    this.attrbutevalueset = attrValues.beans[id];
                    break;
                }
            }
            if (!this.attrbutevalueset) {
                this.createAttributeValueSet();
            }
        } else {
            this.model.data.productattributevalues = {
                beans: {}
            };
            this.createAttributeValueSet();
        }
    }
}
