/**
 * @module ModuleProducts
 */
import {Component} from '@angular/core';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {navigation} from '../../../services/navigation.service';
import {Router} from "@angular/router";


/**
 * @ignore
 */
declare var moment: any;

@Component({
    templateUrl: './src/modules/products/templates/productmanager.html',
    providers: [model]
})
export class ProductManager {

    private selectedItem: any = {};

    constructor(private language: language, private model: model, private navigation: navigation, private router: Router) {
        this.navigation.setActiveModule('Products');
    }

    get canAddVariant() {
        return this.selectedItem.type === 'Product';
    }

    private addVariant() {
        let parent = {
            module: 'Products',
            id: this.selectedItem.object.id,
            data: this.selectedItem.object
        };
        this.model.module = 'ProductVariants';
        this.model.addModel('', parent);
    }

    private selectionChanged(data) {
        if (data.object) {
            this.selectedItem = data;
            if (data.object.goDetail) {
                data.object.goDetail();
            }
        }
    }
}
