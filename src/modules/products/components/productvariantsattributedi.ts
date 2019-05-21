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
 * @ignore
 */

@Component({
    selector: 'product-variants-attribute-di',
    templateUrl: './src/modules/products/templates/productvariantsattributedi.html'
})

export class ProductVariantsAttributeDI extends ProductVariantsAttributeVC {

    constructor(public language: language, public backend: backend, public elementRef: ElementRef, public view: view, public model: model) {
        super(language, backend, elementRef, view, model);
    }

    get attributeValues() {
        let retArray = [];

        if (this.attribute.validations) {
            for (let validation of this.attribute.validations) {
                if (validation.value && validation.value != '') {
                    retArray.push(validation.value);
                }
            }
        }
        return retArray.sort((a, b) => {
            return a.toLowerCase() > b.toLowerCase() ? 1 : -1;
        });
    }
}
