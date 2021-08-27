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
    templateUrl: './src/modules/aclterritories/templates/aclterritorriesmanagerterritories.html',
})
export class ACLTerritorriesManagerTerritories {

    /**
     * indicator when the territories list is loading
     */
    private loading: boolean = false;

    /**
     * the list of territory types
     */
    private types: ACLTerritoryTypeI[] = [];

    /**
     * the currently active type id
     */
    private activeType: string = '';

    /**
     * the currently selected territory id
     */
    private activeTerritoryId: string = '';

    /**
     * searchterm for the territory search
     */
    private searchterm: string = '';

    /**
     * the list of loaded territories
     */
    private territorieslist: any[] = [];

    /**
     * emits when a territory is selected
     */
    @Output() private territoryselected: EventEmitter<any> = new EventEmitter<any>();

    /**
     * emits when the type has changed
     */
    @Output() private typeselected: EventEmitter<any> = new EventEmitter<any>();

    constructor(private backend: backend, private modal: modal, private language: language, private modelutilities: modelutilities) {
        this.loadTypes();
    }

    /**
     * loads the territory types
     */
    private loadTypes() {
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
    private loadTerritories() {
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
    private onKeyUp(event) {
        switch (event.key) {
            case 'Enter':
                this.loadTerritories();
                break;
        }
    }

    /**
     * renders an add modal window
     */
    private addTerritory() {
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
    private typeChanged(event) {
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
    private selectTerritory(territory) {
        this.activeTerritoryId = territory.id;
        this.territoryselected.emit(territory);
    }

    /**
     * delete a territory
     *
     * @param territory
     */
    private deleteTerritory(territory) {
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
