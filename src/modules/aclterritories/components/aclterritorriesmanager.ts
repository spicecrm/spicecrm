/**
 * @module ModuleACLTerritories
 */
import {Component} from '@angular/core';
import {backend} from '../../../services/backend.service';
import {navigationtab} from '../../../services/navigationtab.service';
import {language} from '../../../services/language.service';

/**
 * a manager component in the admin section for the sales territories
 */
@Component({
    templateUrl: '../templates/aclterritorriesmanager.html',
})
export class ACLTerritorriesManager {


    /**
     * the id of the current active territory
     */
    public activeTerritoryId: string = '';

    /**
     * the data of the current active territory
     */
    public activeTerritoryData: any = {};

    /**
     * the currently active territory type
     */
    public activeTerritoryType: string = '';

    constructor(public language: language, public navigationtab: navigationtab, public backend: backend) {
        this.setTabTitle();
    }

    /**
     * sets the tab title
     */
    public setTabTitle() {
        this.navigationtab.setTabInfo({
            displayicon: 'settings',
            displayname: this.language.getLabel('LBL_SPICEACLTERRITORIES')
        });
    }

    /**
     * listens to the change event on the territories list
     *
     * @param territory
     */
    public setTerritory(territory){
        this.activeTerritoryId = territory.id;
        this.activeTerritoryData = territory;
    }

    /**
     * listens to the change event on the territories selector
     * @param type
     */
    public setType(type){
        this.activeTerritoryType = type;
    }

}
