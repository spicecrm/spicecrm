import {Component, ElementRef} from '@angular/core';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';
import {view} from '../../../services/view.service';
import {ProductVariantsAttributeVC} from './productvariantsattributevc';
import {Subscription} from "rxjs";

@Component({
    selector: 'product-variants-attribute-s',
    templateUrl: './src/modules/products/templates/productvariantsattributess.html'
})
export class ProductVariantsAttributeSS extends ProductVariantsAttributeVC {

    private arrayvalue: any[] = [];
    private subscription: Subscription = new Subscription();

    constructor(public language: language, public backend: backend, public elementRef: ElementRef, public view: view, public model: model) {
        super(language, backend, elementRef, view, model);
        this.subscription = this.view.mode$.subscribe(mode => {
            if (mode == 'edit') {
                let val = this.attrbutevalueset.pratvalue;
                this.arrayValue = val && val.length > 1 ? val.split(',') : [];
            }
        });
    }

    get attributeValues() {
        return this.attribute.validations ? this.attribute.validations
            .map(validation => {
                validation = validation.value;
                return validation;
            }) : [];
    }

    get arrayValue() {
        return this.arrayvalue;
    }

    set arrayValue(value) {
        this.arrayvalue = value;
        this.value = value.length > 0 ? value.join(',') : '';
    }

    private trackByFn(index, item) {
        return index;
    }

    public ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
