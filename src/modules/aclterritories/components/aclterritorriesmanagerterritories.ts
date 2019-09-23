/**
 * @module ModuleACLTerritories
 */
import {
    AfterViewInit,
    ComponentFactoryResolver,
    Component,
    ElementRef,
    NgModule,
    ViewChild,
    ViewContainerRef,
    Output,
    EventEmitter
} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {modal} from '../../../services/modal.service';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';
import {modelutilities} from '../../../services/modelutilities.service';
import {navigation} from '../../../services/navigation.service';


@Component({
    selector: 'aclterritorries-manager-territories',
    templateUrl: './src/modules/aclterritories/templates/aclterritorriesmanagerterritories.html',
})
export class ACLTerritorriesManagerTerritories {

    loading: boolean = false;

    types: Array<any> = [];
    activeType: string = '';
    activeTerritoryId: string = '';
    searchterm: string = '';

    territorieslist: Array<any> = [];

    @Output() territoryselected: EventEmitter<any> = new EventEmitter<any>();
    @Output() typeselected: EventEmitter<any> = new EventEmitter<any>();

    constructor(private backend: backend, private modal: modal, private language: language, private modelutilities: modelutilities) {
        this.backend.getRequest('spiceaclterritories/core/orgobjecttypes').subscribe(types => {
            this.types = types;

            this.types.sort((a, b) => {
                return a.name > b.name ? 1 : -1;
            })
        })
    }

    loadTerritories() {
        this.loading = true;

        this.backend.getRequest('spiceaclterritories/core/territories', {
            searchterm: this.searchterm,
            territorytype_id: this.activeType
        }).subscribe(territories => {
            this.territorieslist = territories;
            this.loading = false;
        })
    }

    private onKeyUp(event) {
        switch (event.key) {
            case 'Enter':
                this.loadTerritories();
                break;
        }
    }

    addTerritory() {
        this.modal.openModal('ACLTerritorriesManagerTerritoryAddModal').subscribe(modalref =>{
            modalref.instance.territorytype = this.activeType;
            modalref.instance.newterritory.subscribe(newterritory => {
                this.territorieslist.push(newterritory);
                this.selectTerritory(newterritory);
            })
        })
    }

    typeChanged(event) {
        // rteset the active one
        this.activeTerritoryId = '';
        this.territoryselected.emit({});

        // load territorries
        this.loadTerritories();
        this.typeselected.emit(this.activeType);
    }

    selectTerritory(territory){
        this.activeTerritoryId = territory.id;
        this.territoryselected.emit(territory);
    }

    deleteTerritory(territory){
        this.backend.deleteRequest('spiceaclterritories/core/territories/'+territory.id).subscribe(response => {
            this.territorieslist.some((thisterritory, index) => {
                if(thisterritory.id == territory.id){
                    this.territorieslist.splice(index, 1);
                    return true;
                }
            })
        })
    }

}