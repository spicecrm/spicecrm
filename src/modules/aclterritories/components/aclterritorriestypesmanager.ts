/**
 * @module ModuleACLTerritories
 */
import {Component} from '@angular/core';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';
import {navigationtab} from '../../../services/navigationtab.service';


@Component({
    templateUrl: '../templates/aclterritorriestypesmanager.html',
})
export class ACLTerritorriesTypesmanager {

    public activeType: string = '';

    constructor(public language: language, public backend: backend, public navigationtab: navigationtab) {
        this.setTabTitle();
    }

    /**
     * sets the tab title
     */
    public setTabTitle() {
        this.navigationtab.setTabInfo({
            displayicon: 'settings',
            displayname: this.language.getLabel('LBL_TERRITORY_TYPES')
        });
    }

    public setType(newType) {
        this.activeType = newType;
    }

}
