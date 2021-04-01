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
            this.backend.getRequest('spiceaclterritories/core/orgobjecttypes/' + this.territorytype).subscribe(territorrytypedetails => {
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
