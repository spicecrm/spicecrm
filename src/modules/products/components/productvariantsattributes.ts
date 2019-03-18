/**
 * @module ModuleProducts
 */
import {Component, OnDestroy} from '@angular/core';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {Subscription} from "rxjs";
import {backend} from "../../../services/backend.service";

/**
 * @ignore
 */
declare var moment: any;

@Component({
    selector: 'product-variants-attributes',
    templateUrl: './src/modules/products/templates/productvariantsattributes.html'
})
export class ProductVariantsAttributes implements OnDestroy {

    public attributes: any[] = [];
    private productId: string = '';
    private isLoading: boolean = false;
    private subscription: Subscription = new Subscription();

    constructor(private language: language, private model: model, private backend: backend) {
        this.subscription = this.model.data$.subscribe(data => {
            this.loadAttributes(data);
        });
    }

    public ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    public ngOnInit() {
        this.loadAttributes(this.model.data);
    }

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

        let newProductId = data[parentField];
        if (newProductId && newProductId.length > 0 && newProductId != this.productId) {
            this.isLoading = true;
            this.productId = newProductId;
            this.backend.getRequest(`${type}/${newProductId}/productattributes/direct`)
                .subscribe(attributes => {
                    this.attributes = attributes;
                    this.isLoading = false;
                }, err => this.isLoading = false);
        } else if (!newProductId) {
            this.productId = '';
            this.attributes = [];
        }
    }
}
