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
    templateUrl: '../templates/productgroupmanager.html',
    providers: [productfinder, model]
})

export class ProductGroupManager {

    /**
     * the id of the currently selected group
     */
    public selectedGroupId: string;

    /**
     * the actionset
     */
    public actionSet: string = '';

    constructor(public language: language, public navigationtab: navigationtab, public metadata: metadata, public model: model) {
        this.model.module = 'ProductGroups';
        this.navigationtab.setTabInfo({displaymodule: 'ProductGroups', displayname: this.language.getLabel('LBL_PRODUCT_GROUP_MANAGER')})
        this.getActionSet();
    }

    /**
     * called in the contructor to get the actionset from the config
     */
    public getActionSet() {
        let conf = this.metadata.getComponentConfig('ProductGroupManager', 'ProductGroups');
        this.actionSet = conf && conf.actionset ? conf.actionset : '';
    }

    /**
     * fires when the selection changes
     *
     * @param data
     */
    public selectionChanged(data) {
        this.selectedGroupId = data.object.id;
    }
}
