import {Component, ViewChild, ViewContainerRef} from '@angular/core';
import {language} from '../../../services/language.service';
import {navigation} from '../../../services/navigation.service';
import {productfinder} from "../services/productfinder.service";

@Component({
    templateUrl: './src/modules/products/templates/productgroupmanager.html',
    providers: [productfinder]
})

export class ProductGroupManager {

    @ViewChild("bodycontainer", {read: ViewContainerRef}) private bodyContainer: ViewContainerRef;

    private selectedGroupId: string;

    constructor(private language: language, private navigation: navigation) {
        this.navigation.setActiveModule('ProductGroups');
    }

    get bodyStyle() {
        return {height: `calc(100vh - ${this.bodyContainer.element.nativeElement.offsetHeight}`};
    }

    selectionChanged(data) {
        this.selectedGroupId = data.object.id;
    }
}
