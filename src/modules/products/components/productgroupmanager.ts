import {Component, ViewChild, ViewContainerRef} from '@angular/core';
import {language} from '../../../services/language.service';
import {navigation} from '../../../services/navigation.service';
import {productfinder} from "../services/productfinder.service";
import {metadata} from "../../../services/metadata.service";
import {model} from "../../../services/model.service";

@Component({
    templateUrl: './src/modules/products/templates/productgroupmanager.html',
    providers: [productfinder, model]
})

export class ProductGroupManager {

    @ViewChild("actionSetContainer", {read: ViewContainerRef}) private actionSetContainer: ViewContainerRef;

    private selectedGroupId: string;
    private actionSet: string = '';

    constructor(private language: language, private navigation: navigation, private metadata: metadata, private model: model) {
        this.model.module = 'ProductGroups';
        this.navigation.setActiveModule('ProductGroups');
        this.getActionSet();
    }

    private getActionSet() {
        let conf = this.metadata.getComponentConfig('ProductGroupManager', 'ProductGroups');
        this.actionSet = conf && conf.actionset ? conf.actionset : '';
    }

    private selectionChanged(data) {
        this.selectedGroupId = data.object.id;
    }
}
