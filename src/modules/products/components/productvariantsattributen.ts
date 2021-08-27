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
declare var moment: any;

@Component({
    selector: 'product-variants-attribute-n',
    templateUrl: './src/modules/products/templates/productvariantsattributen.html'
})
export class ProductVariantsAttributeN extends ProductVariantsAttributeVC {

    constructor(public language: language, public backend: backend, public elementRef: ElementRef, public view: view, public model: model) {
        super(language, backend, elementRef, view, model);
    }

    get precision() {
        return this.attribute.prat_precision;
    }

    get valueTo() {
        let vali = this.attribute.validations;
        vali = vali && vali.length > 0 ? vali[0] : {};
        return parseInt(vali.value_to, 10);
    }

    get valueFrom() {
        let vali = this.attribute.validations;
        vali = vali && vali.length > 0 ? vali[0] : {};
        return parseInt(vali.value_from, 10);
    }

    get uom() {
        return this.attribute.uom;
    }
}
