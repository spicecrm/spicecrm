/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

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
     * loads the territory typoes
     */
    private loadTypes() {
        this.backend.getRequest('spiceaclterritories/core/orgobjecttypes').subscribe(types => {
            this.types = types;

            this.types.sort((a, b) => {
                return a.name > b.name ? 1 : -1;
            });
        });
    }

    /**
     * loads the territories for a selecterd type
     */
    private loadTerritories() {
        this.loading = true;

        this.backend.getRequest('spiceaclterritories/core/territories', {
            searchterm: this.searchterm,
            territorytype_id: this.activeType
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
            if(response){
                this.backend.deleteRequest('spiceaclterritories/core/territories/' + territory.id).subscribe(response => {
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
