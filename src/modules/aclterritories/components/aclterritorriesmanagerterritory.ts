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

/**
 * part of the territories manager displaying the details of a territory
 */
@Component({
    selector: 'aclterritorries-manager-territory',
    templateUrl: '../templates/aclterritorriesmanagerterritory.html',
    providers: [model, view]
})
export class ACLTerritorriesManagerTerritory implements OnChanges {

    /**
     * input for the id of the selected territory
     * required to trigger ngOnChanges
     */
    @Input() public modelid;

    /**
     * input for the data of thje selected territory
     */
    @Input() public modeldata;

    /**
     * input for the selected territorytype
     */
    @Input() public territorytype: string = '';

    /**
     * the id of the loaded territory typy
     */
    public loadedterritorytype: string = '';

    /**
     * the data of the laoded territorytype
     */
    public territorrytypedetails: any = {};


    constructor(public backend: backend, public modal: modal, public model: model, public view: view, public language: language, public modelutilities: modelutilities) {
        this.model.module = 'SpiceACLTerritories';
        this.view.isEditable = true;
    }

    public ngOnChanges() {
        this.handleChanges();
    }

    /**
     * handles the changes in the onChange lifecycle
     */
    public handleChanges(){
        this.model.id = this.modelid;
        this.model.setData( this.modeldata);

        // load type
        if (this.territorytype != '' && this.territorytype != this.loadedterritorytype) {
            this.backend.getRequest('module/SpiceACLTerritories/core/territorytypes/' + this.territorytype).subscribe(territorrytypedetails => {
                this.territorrytypedetails = territorrytypedetails;
                this.loadedterritorytype = this.territorytype;
            });
        }
    }

    /**
     * cancel the editing process
     */
    public cancelEdit() {
        this.model.cancelEdit();
        this.view.setViewMode();
    }

    /**
     * save the territory changes
     */
    public saveTerritory() {
        this.model.save().subscribe(success => {
            this.modeldata = this.model.data;
            this.view.setViewMode();
        });

    }

    /**
     * simple getter to return if the view is in edit mode
     */
    get isEditMode() {
        return this.view.isEditMode();
    }

}
