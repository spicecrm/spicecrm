/**
 * @module services
 */
import {Injectable} from '@angular/core';

import {configurationService} from './configuration.service';
import {session} from './session.service';
import {metadata} from './metadata.service';
import {backend} from './backend.service';

@Injectable()
export class territories {

    public addTerritories: any = {};

    constructor(public backend: backend, public metadata: metadata, public configurationService: configurationService, public session: session) {

    }

    /**
     * checks if a module is territory managed
     * @param module
     */
    public checkModuleManaged(module) {
        return this.getModuleParamaters(module) ? true : false;
    }

    /**
     * checks if there are paramaters for the module
     *
     * @param module the name of the module
     */
    public getModuleParamaters(module) {
        let types = this.configurationService.getData('aclterritorymoduletypes');
        if (types) {
            let moduelType = types.find(typeRecord => typeRecord.module == module);
            return moduelType;
        } else {
            return false;
        }
    }

    /**
     * returns the user territories as they are retrived from the backend
     */
    get userTerritories() {
        return this.configurationService.getData('aclterritoryuserterritories');
    }

    /**
     * returns a list of recent used territories (if there are any. Otherwise the first n entries from the user territories
     *
     * @param count the number of records to be returned
     */
    public getRecentTerritories(module, count = 5, action?) {
        let territorries = this.userTerritories;
        if (action && !this.session.isAdmin) {
            let actionTerritories = territorries[module] && territorries[module].length > 0 ? territorries[module].filter(a => a.actions.indexOf(action) != -1) : [];
            return actionTerritories && actionTerritories.length > 0 ? actionTerritories.slice(0, count) : [];
        } else {
            return territorries[module] && territorries[module].length > 0 ? territorries[module].slice(0, count) : [];
        }
    }

    /**
     * returns the name of a specified territory
     * @param territory
     */
    public loadTerritoryName(territory) {
        this.addTerritories[territory] = '...';
        this.backend.getRequest('module/SpiceACLTerritories/' + territory)
            .subscribe((response: any) => {
                if (response.id === territory) {
                    this.addTerritories[territory] = response.name;
                } else {
                    this.addTerritories[territory] = 'error';
                }
            });
    }

    public searchTerritories(module, searchterm, items = 5, activeterritories = [], action?) {
        let retArray = [];

        for (let territory of this.userTerritories[module]) {
            if (territory.name.toLowerCase().indexOf(searchterm.toLowerCase()) >= 0 && activeterritories.indexOf(territory.id) < 0 && (this.session.isAdmin || !action || action && territory.actions.indexOf(action) != -1)) {
                retArray.push(territory);
            }

            // check if we did reach the number we are looking for
            if (retArray.length >= items) {
                return retArray;
            }
        }

        return retArray;
    }

    public isUserTerritory(module, territory) {
        let userTerritory: boolean = false;
        this.userTerritories[module].some(thisTerritorry => {
            if (thisTerritorry.id === territory) {
                userTerritory = true;
                return true;
            }
        });

        return userTerritory;
    }

    public getTerritoryName(module, territory) {
        let territoryName = '';
        this.userTerritories[module].some(thisTerritorry => {
            if (thisTerritorry.id === territory) {
                territoryName = thisTerritorry.name;
                return true;
            }
        });

        if (territoryName === '') {
            if (!this.addTerritories[territory]) {
                this.loadTerritoryName(territory);
            }
            territoryName = this.addTerritories[territory];
        }
        return territoryName;
    }

}
