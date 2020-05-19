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
    templateUrl: './src/modules/aclterritories/templates/aclterritorriesmanager.html',
})
export class ACLTerritorriesManager {


    /**
     * the id of the current active territory
     */
    private activeTerritoryId: string = '';

    /**
     * the data of the current active territory
     */
    private activeTerritoryData: any = {};

    /**
     * the currently active territory type
     */
    private activeTerritoryType: string = '';

    constructor(private language: language, private navigationtab: navigationtab, private backend: backend) {
        this.setTabTitle();
    }

    /**
     * sets the tab title
     */
    private setTabTitle() {
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
    private setTerritory(territory){
        this.activeTerritoryId = territory.id;
        this.activeTerritoryData = territory;
    }

    /**
     * listens to the change event on the territories selector
     * @param type
     */
    private setType(type){
        this.activeTerritoryType = type;
    }

}
