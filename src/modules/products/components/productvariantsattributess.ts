/**
 * @module ModuleProducts
 */
import {Component, ElementRef} from '@angular/core';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';
import {view} from '../../../services/view.service';
import {ProductVariantsAttributeVC} from './productvariantsattributevc';

/**
 * Display the product variant attribute value from type checkbox
 */
@Component({
    selector: 'product-variants-attribute-s',
    templateUrl: './src/modules/products/templates/productvariantsattributess.html'
})
export class ProductVariantsAttributeSS extends ProductVariantsAttributeVC {

    constructor(public language: language, public backend: backend, public elementRef: ElementRef, public view: view, public model: model) {
        super(language, backend, elementRef, view, model);
    }

    /**
     * @return value array
     */
    private _valueArray: any[] = [];
    /**
     * @return value array
     */
    get valueArray() {
        if (this._valueArray.length == 0 && this.value && typeof this.value == 'string') {
            return this._valueArray = this.value.length > 2 ? this.value.split(',') : [];
        }
        return this._valueArray;
    }

    /**
     * return attribute values
     */
    get attributeValues() {
        return this.attribute.validations ? this.attribute.validations
            .map(validation => {
                validation = validation.value;
                return validation;
            })
            .sort((a, b) => a.toLowerCase() > b.toLowerCase() ? 1 : -1) : [];
    }

    /**
     * set value from array
     * @param value
     */
    private setValue(value: any[]) {
        this.value = value.length > 1 ? value.join(',') : value.toString();

    }

    /**
     * A function that defines how to track changes for items in the iterable (ngForOf).
     * https://angular.io/api/common/NgForOf#properties
     * @param index
     * @param item
     * @return item.id
     */
    private trackByFn(index, item) {
        return index;
    }
}
