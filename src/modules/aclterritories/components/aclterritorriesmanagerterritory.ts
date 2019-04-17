/**
 * @module ModuleACLTerritories
 */
import {
    Component,
    OnChanges,
    Input
} from '@angular/core';
import {modal} from '../../../services/modal.service';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';
import {modelutilities} from '../../../services/modelutilities.service';


@Component({
    selector: 'aclterritorries-manager-territory',
    templateUrl: './src/modules/aclterritories/templates/aclterritorriesmanagerterritory.html',
    providers: [model, view]
})
export class ACLTerritorriesManagerTerritory implements OnChanges{

    @Input() modelid;
    @Input() modeldata;
    @Input() territorytype: string = '';
    loadedterritorytype: string = '';
    territorrytypedetails: any = {};


    constructor(private backend: backend, private modal: modal, private model: model, private view: view, private language: language, private modelutilities: modelutilities) {
        this.model.module = 'SpiceACLTerritories';

        this.view.isEditable = true;
        // this.view.setEditMode();
    }

    ngOnChanges(){

        this.model.id = this.modelid;
        this.model.data = this.modelutilities.backendModel2spice(this.model.module, this.modeldata);

        // load type
        if(this.territorytype != '' && this.territorytype != this.loadedterritorytype) {
            this.backend.getRequest('spiceaclterritories/core/orgobjecttypes/' + this.territorytype).subscribe(territorrytypedetails => {
                this.territorrytypedetails = territorrytypedetails;
                this.loadedterritorytype = this.territorytype;
            })
        }

    }

    cancelEdit(){
        this.model.cancelEdit();
        this.view.setViewMode();
    }

    saveTerritory(){
        this.model.save().subscribe(success => {
            this.modeldata = this.model.data;
            this.view.setViewMode();
        });

    }

    get isEditMode(){
        return this.view.isEditMode();
    }

    activateTerritory(){

    }

    deactivateTerritory(){

    }

}