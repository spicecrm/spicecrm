import {AfterViewInit, Component, OnDestroy} from '@angular/core';
import {language} from '../../../services/language.service';
import {Subscription} from "rxjs";
import {model} from "../../../services/model.service";
import {backend} from "../../../services/backend.service";

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
            this.loadAttributes(data['product_id']);
        });
    }

    public ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    public ngOnInit() {
        this.loadAttributes(this.model.data['product_id']);
    }

    private loadAttributes(newProductId) {
        if (newProductId && newProductId.length > 0 && newProductId != this.productId) {
            this.isLoading = true;
            this.productId = newProductId;
            this.backend.getRequest(`products/${newProductId}/productattributes/direct`)
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
