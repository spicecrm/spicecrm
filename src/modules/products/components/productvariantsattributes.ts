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
    templateUrl: '../templates/productvariantsattributes.html'
})
export class ProductVariantsAttributes implements OnDestroy {
    /***
     * holds the group attributes
     */
    public attributes: any[] = [];
    /**
     * holds the parent id
     */
    public parentId: string = '';
    /**
     * holds the loading boolean
     */
    public isLoading: boolean = false;
    /**
     * subscription to unsubscribe on destroy
     */
    public subscription: Subscription = new Subscription();

    constructor(public language: language, public model: model, public backend: backend) {
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
    public loadAttributes(data) {
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
    public loadAttributeValues() {
        if (!this.model.getField('productattributevalues')) {
            this.model.setField('productattributevalues', {beans: {}});
        }
    }
}
