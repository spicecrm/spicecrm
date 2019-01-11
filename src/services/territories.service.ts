import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {Subject, Observable} from 'rxjs';
import {CanActivate} from '@angular/router';

import {configurationService} from './configuration.service';
import {session} from './session.service';
import {metadata} from './metadata.service';
import {backend} from './backend.service';

@Injectable()
export class territories {

    public userTerritories: any = {};
    private addTerritories: any = {};

    constructor(private backend: backend, private metadata: metadata, private configurationService: configurationService, private session: session) {

    }

    public getTerritories(loadhandler: Subject<string>) {
        if (sessionStorage[window.btoa('territorries' + this.session.authData.sessionId)] && sessionStorage[window.btoa('territorries' + this.session.authData.sessionId)].length > 0 && !this.configurationService.data.developerMode) {
            this.userTerritories = this.session.getSessionData('territorries');
            loadhandler.next('getTerritorries');
        } else {
            this.loadTerritories().subscribe(() => {
                loadhandler.next('getTerritorries');
            });
        }
    }

    public loadTerritories() {
        let retSubject = new Subject();

        let modules: string[] = [];
        for (let module of this.metadata.getModules()) {
            if (module !== 'Home') {
                modules.push(module);
            }
        }

        this.backend.getRequest('territories')
            .subscribe(response => {
                this.session.setSessionData('territorries', response);
                this.userTerritories = response;

                retSubject.next(true);
                retSubject.complete();
            });

        return retSubject.asObservable();
    }

    public loadTerritoryName(territory) {
        this.addTerritories[territory] = '...';
        this.backend.getRequest('territories/' + territory)
            .subscribe((response: any) => {
                if (response.id === territory) {
                    this.addTerritories[territory] = response.name;
                } else {
                    this.addTerritories[territory] = 'error';
                }
            });
    }

    public searchTerritories(module, searchterm, items = 5, activeterritories = []) {
        let retArray = [];

        for (let territory of this.userTerritories[module]) {
            if (territory.name.toLowerCase().indexOf(searchterm.toLowerCase()) >= 0 && activeterritories.indexOf(territory.id) < 0) {
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
