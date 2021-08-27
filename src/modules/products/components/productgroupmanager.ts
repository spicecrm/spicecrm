/**
 * @module ModuleProducts
 */
import {Component, ViewChild, ViewContainerRef} from '@angular/core';
import {language} from '../../../services/language.service';
import {navigationtab} from '../../../services/navigationtab.service';
import {productfinder} from "../services/productfinder.service";
import {metadata} from "../../../services/metadata.service";
import {model} from "../../../services/model.service";

@Component({
    templateUrl: './src/modules/products/templates/productgroupmanager.html',
    providers: [productfinder, model]
})

export class ProductGroupManager {

    /**
     * the id of the currently selected group
     */
    private selectedGroupId: string;

    /**
     * the actionset
     */
    private actionSet: string = '';

    constructor(private language: language, private navigationtab: navigationtab, private metadata: metadata, private model: model) {
        this.model.module = 'ProductGroups';
        this.navigationtab.setTabInfo({displaymodule: 'ProductGroups', displayname: this.language.getLabel('LBL_PRODUCT_GROUP_MANAGER')})
        this.getActionSet();
    }

    /**
     * called in the contructor to get the actionset from the config
     */
    private getActionSet() {
        let conf = this.metadata.getComponentConfig('ProductGroupManager', 'ProductGroups');
        this.actionSet = conf && conf.actionset ? conf.actionset : '';
    }

    /**
     * fires when the selection changes
     *
     * @param data
     */
    private selectionChanged(data) {
        this.selectedGroupId = data.object.id;
    }
}
