/**
 * @module ModuleProducts
 */
import {Component} from '@angular/core';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {navigationtab} from '../../../services/navigationtab.service';
import {Router} from "@angular/router";


/**
 * @ignore
 */
declare var moment: any;

/**
 * renders the product mnager that display productgroups, selection options and then the product variants
 */
@Component({
    templateUrl: './src/modules/products/templates/productmanager.html',
    providers: [model]
})
export class ProductManager {

    /**
     * the selected item
     */
    private selectedItem: any = {};

    constructor(private language: language, private model: model, private navigationtab: navigationtab, private router: Router) {
        this.navigationtab.setTabInfo({displayname: this.language.getLabel('LBL_PRODUCT_MANAGER'), displaymodule: 'Products'});
    }

    /**
     * getter to return if a product variant can be added
     */
    get canAddVariant() {
        return this.selectedItem.type === 'Product';
    }

    /**
     * adds the variant
     */
    private addVariant() {
        let parent = {
            module: 'Products',
            id: this.selectedItem.object.id,
            data: this.selectedItem.object
        };
        this.model.module = 'ProductVariants';
        this.model.addModel('', parent);
    }

    /**
     * fired when the selection changes
     *
     * @param data
     */
    private selectionChanged(data) {
        if (data.object) {
            this.selectedItem = data;
            if (data.object.goDetail) {
                data.object.goDetail();
            }
        }
    }
}
