/**
 * @module ModuleProducts
 */
import {Component, OnDestroy} from '@angular/core';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {Subscription} from "rxjs";
import {backend} from "../../../services/backend.service";

/**
 * display and manage the group attributes
 */
@Component({
    selector: 'product-variants-attributes',
    templateUrl: './src/modules/products/templates/productvariantsattributes.html'
})
export class ProductVariantsAttributes implements OnDestroy {
    /***
     * holds the group attributes
     */
    public attributes: any[] = [];
    /**
     * holds the parent id
     */
    private parentId: string = '';
    /**
     * holds the loading boolean
     */
    private isLoading: boolean = false;
    /**
     * subscription to unsubscribe on destroy
     */
    private subscription: Subscription = new Subscription();

    constructor(private language: language, private model: model, private backend: backend) {
        this.subscription = this.model.data$.subscribe(data => {
            this.loadAttributes(data);
        });
    }

    /**
     * unsubscribe from subscriptions
     */
    public ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    /**
     * call to load the attributes
     */
    public ngOnInit() {
        this.loadAttributes(this.model.data);
        this.loadAttributeValues();
    }

    /**
     * load the attributes from backend
     * @param data
     */
    private loadAttributes(data) {
        let parentField;
        let type;
        switch (this.model.module) {
            case 'ProductVariants':
                parentField = 'product_id';
                type = 'Products';
                break;
            case 'Products':
                parentField = 'productgroup_id';
                type = 'ProductGroups';
                break;
        }

        const parentFieldId = data[parentField];
        if (!!parentFieldId && parentFieldId != this.parentId) {
            this.isLoading = true;
            this.parentId = parentFieldId;
            this.backend.getRequest(`module/${type}/${parentFieldId}/ProductAttributes/direct`)
                .subscribe(attributes => {
                    this.attributes = attributes.sort((a, b) => +a.sort_sequence > +b.sort_sequence ? 1 : -1);
                    this.isLoading = false;
                }, err => this.isLoading = false);
        } else if (!parentFieldId) {
            this.parentId = '';
            this.attributes = [];
        }
    }

    /**
     * load the attribute values
     */
    private loadAttributeValues() {
        if (!this.model.data.productattributevalues) {
            this.model.data.productattributevalues = {beans: {}};
        }
    }
}
