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
    templateUrl: './src/modules/aclterritories/templates/aclterritorriesmanagerterritory.html',
    providers: [model, view]
})
export class ACLTerritorriesManagerTerritory implements OnChanges {

    /**
     * input for the id of the selected territory
     * required to trigger ngOnChanges
     */
    @Input() private modelid;

    /**
     * input for the data of thje selöected territory
     */
    @Input() private modeldata;

    /**
     * input for the selected territorytype
     */
    @Input() private territorytype: string = '';

    /**
     * the id of the loaded territory typy
     */
    private loadedterritorytype: string = '';

    /**
     * the data of the laoded territorytype
     */
    private territorrytypedetails: any = {};


    constructor(private backend: backend, private modal: modal, private model: model, private view: view, private language: language, private modelutilities: modelutilities) {
        this.model.module = 'SpiceACLTerritories';
        this.view.isEditable = true;
    }

    public ngOnChanges() {
        this.handleChanges();
    }

    /**
     * handles the changes in the onChange lifecycle
     */
    private handleChanges(){
        this.model.id = this.modelid;
        this.model.data = this.modelutilities.backendModel2spice(this.model.module, this.modeldata);

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
    private cancelEdit() {
        this.model.cancelEdit();
        this.view.setViewMode();
    }

    /**
     * save the territory changes
     */
    private saveTerritory() {
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
