import {Component, ElementRef} from '@angular/core';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';
import {view} from '../../../services/view.service';
import {ProductVariantsAttributeVC} from './productvariantsattributevc';

@Component({
    selector: 'product-variants-attribute-s',
    templateUrl: './src/modules/products/templates/productvariantsattributess.html'
})
export class ProductVariantsAttributeSS extends ProductVariantsAttributeVC {

    constructor(public language: language, public backend: backend, public elementRef: ElementRef, public view: view, public model: model) {
        super(language, backend, elementRef, view, model);
    }

    get attributeValues() {
        return this.attribute.validations ? this.attribute.validations
            .map(validation => {
                validation = validation.value;
                return validation;
            }) : [];
    }

    get value() {
        let val = this.attrbutevalueset.pratvalue;
        if (val && typeof val != 'string') {
            return val;
        }
        return this.attrbutevalueset.pratvalue = val.length > 1 ? val.split(',') : [val];
    }

    set value(value) {
        this.attrbutevalueset.pratvalue = value.length > 1 ? value.join(',') : value.toString();

    }

    private trackByFn(index, item) {
        return index;
    }
}
