import {Component} from '@angular/core';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {navigation} from '../../../services/navigation.service';
import {Router} from "@angular/router";
import {productfinder} from "../services/productfinder.service";

@Component({
    templateUrl: './src/modules/products/templates/productgroupmanager.html',
    providers:[productfinder, model]

})

export class ProductGroupManager {

    private selectedGroupId: string;

    constructor(private language: language, private model: model, private navigation: navigation, private router: Router) {
        this.navigation.setActiveModule('ProductGroups');
        this.model.module = 'ProductGroups';
    }

    selectionChanged(data) {
        this.selectedGroupId = data.object.id;
    }
}
