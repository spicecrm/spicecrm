/**
 * @module ModuleACLTerritories
 */
import {
    Component,
    Output,
    EventEmitter
} from '@angular/core';
import {modal} from '../../../services/modal.service';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';
import {modelutilities} from '../../../services/modelutilities.service';
import {ACLTerritoryTypeI} from "../../../modules/aclterritories/interfaces/moduleaclterritories.interfaces";

/**
 * part of the territories manager listing the territories for a given territory type
 */
@Component({
    selector: 'aclterritorries-manager-territories',
    templateUrl: '../templates/aclterritorriesmanagerterritories.html',
})
export class ACLTerritorriesManagerTerritories {

    /**
     * indicator when the territories list is loading
     */
    public loading: boolean = false;

    /**
     * the list of territory types
     */
    public types: ACLTerritoryTypeI[] = [];

    /**
     * the currently active type id
     */
    public activeType: string = '';

    /**
     * the currently selected territory id
     */
    public activeTerritoryId: string = '';

    /**
     * searchterm for the territory search
     */
    public searchterm: string = '';

    /**
     * the list of loaded territories
     */
    public territorieslist: any[] = [];

    /**
     * emits when a territory is selected
     */
    @Output() public territoryselected: EventEmitter<any> = new EventEmitter<any>();

    /**
     * emits when the type has changed
     */
    @Output() public typeselected: EventEmitter<any> = new EventEmitter<any>();

    constructor(public backend: backend, public modal: modal, public language: language, public modelutilities: modelutilities) {
        this.loadTypes();
    }

    /**
     * loads the territory types
     */
    public loadTypes() {
        this.backend.getRequest('module/SpiceACLTerritories/core/territorytypes').subscribe(types => {
            this.types = types;

            this.types.sort((a, b) => {
                return a.name > b.name ? 1 : -1;
            });
        });
    }

    /**
     * loads the territories for a selected type
     */
    public loadTerritories() {
        this.loading = true;

        this.backend.getRequest('module/SpiceACLTerritories/core/territorytypes/' + this.activeType + '/territories', {
            searchterm: this.searchterm
        }).subscribe(territories => {
            this.territorieslist = territories;
            this.loading = false;
        });
    }

    /**
     * catches the enter key on the serach field and triogger a search
     * @param event
     */
    public onKeyUp(event) {
        switch (event.key) {
            case 'Enter':
                this.loadTerritories();
                break;
        }
    }

    /**
     * renders an add modal window
     */
    public addTerritory() {
        this.modal.openModal('ACLTerritorriesManagerTerritoryAddModal').subscribe(modalref => {
            modalref.instance.territorytype = this.activeType;
            modalref.instance.newterritory.subscribe(newterritory => {
                this.territorieslist.push(newterritory);
                this.selectTerritory(newterritory);
            });
        });
    }

    /**
     * fires when the type has changed resetting the selected terriottry and reloading the list
     * @param event
     */
    public typeChanged(event) {
        // rteset the active one
        this.activeTerritoryId = '';
        this.territoryselected.emit({});

        // load territorries
        this.loadTerritories();
        this.typeselected.emit(this.activeType);
    }

    /**
     * fired when a territory is selected rendering it in teh second view
     * @param territory
     */
    public selectTerritory(territory) {
        this.activeTerritoryId = territory.id;
        this.territoryselected.emit(territory);
    }

    /**
     * delete a territory
     *
     * @param territory
     */
    public deleteTerritory(territory) {
        this.modal.prompt("confirm", this.language.getLabel('MSG_DELETE_RECORD', '', 'long'), this.language.getLabel('MSG_DELETE_RECORD')).subscribe(response => {
            if(response) {
                this.backend.deleteRequest('module/SpiceACLTerritories/' + this.activeTerritoryId).subscribe(response => {
                    this.territorieslist.some((thisterritory, index) => {
                        if (thisterritory.id == territory.id) {
                            this.territorieslist.splice(index, 1);
                            return true;
                        }
                    });
                });
            }
        });
    }

}
