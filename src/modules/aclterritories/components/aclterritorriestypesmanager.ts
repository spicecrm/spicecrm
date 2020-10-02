/**
 * @module ModuleACLTerritories
 */
import {Component} from '@angular/core';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';
import {navigationtab} from '../../../services/navigationtab.service';


@Component({
    templateUrl: './src/modules/aclterritories/templates/aclterritorriestypesmanager.html',
})
export class ACLTerritorriesTypesmanager {

    private activeType: string = '';

    constructor(private language: language, private backend: backend, private navigationtab: navigationtab) {
        this.setTabTitle();
    }

    /**
     * sets the tab title
     */
    private setTabTitle() {
        this.navigationtab.setTabInfo({
            displayicon: 'settings',
            displayname: this.language.getLabel('LBL_TERRITORY_TYPES')
        });
    }

    private setType(newType) {
        this.activeType = newType;
    }

}
