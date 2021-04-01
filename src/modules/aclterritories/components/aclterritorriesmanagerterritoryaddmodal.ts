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
    Input, OnInit, Output, EventEmitter
} from '@angular/core';
import {modal} from '../../../services/modal.service';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';
import {toast} from '../../../services/toast.service';
import {modelutilities} from '../../../services/modelutilities.service';

/**
 * part of the territories manager displaying an add modal
 */
@Component({
    selector: 'aclterritorries-manager-territory-add-modal',
    templateUrl: './src/modules/aclterritories/templates/aclterritorriesmanagerterritoryaddmodal.html',
    providers: [model, view]
})
export class ACLTerritorriesManagerTerritoryAddModal implements OnInit {

    /**
     * reference to the component rendered
     */
    private self: any;

    /**
     * the territory type to be created
     */
    @Input() private territorytype: string = '';

    /**
     * the territory details
     */
    private territorrytypedetails: any = {};

    /**
     * an event emitter top emit when a new territory is created
     */
    @Output() private newterritory: EventEmitter<any> = new EventEmitter<any>();

    constructor(private backend: backend, private modal: modal, private model: model, private view: view, private language: language, private modelutilities: modelutilities, private toast: toast) {
        // initialize the model
        this.initializeModel();

        // initialize the view
        this.initializeView();
    }

    /**
     * set initial view paramaters
     */
    private initializeView() {
        // set the view
        this.view.isEditable = true;
        this.view.displayLabels = false;
        this.view.setEditMode();
    }

    /**
     * setmodel attributes and initialize den m,odel
     */
    private initializeModel() {
        this.model.module = 'SpiceACLTerritories';
        this.model.id = this.modelutilities.generateGuid();
        this.model.initialize();

        this.model.data.inactive = 1;
        this.model.data.usagecount = 0;
    }

    public ngOnInit() {
        // set type
        this.model.data.territorytype_id = this.territorytype;

        // load type
        this.backend.getRequest('spiceaclterritories/core/orgobjecttypes/' + this.territorytype).subscribe(territorrytypedetails => {
            this.model.data.elementvalues = {};
            for (let element of territorrytypedetails.elements) {
                this.model.data.elementvalues[element.id] = {
                    spiceaclterritoryelement_id: element.id,
                    elementvalue: '',
                    elementdescription: '',
                    name: element.name
                };
            }

            this.territorrytypedetails = territorrytypedetails;

        });
    }

    get addDisabled() {
        if (!this.model.data.name) {
            return true;
        }

        if (!this.model.data.elementvalues) {
            return true;
        }

        for (let elementvalue in this.model.data.elementvalues) {
            if (this.model.data.elementvalues[elementvalue].elementvalue == '') {
                return true;
            }
        }

        return false;
    }

    close() {
        this.self.destroy();
    }

    save() {
        this.backend.postRequest('spiceaclterritories/core/territories/check', {}, this.modelutilities.spiceModel2backend('SpiceACLTerrtories', this.model.data)).subscribe(response => {
            if (response.status == 'success') {
                this.backend.postRequest('spiceaclterritories/core/territories/' + this.model.id, {}, this.modelutilities.spiceModel2backend('SpiceACLTerrtories', this.model.data)).subscribe(response => {
                    this.newterritory.emit(this.model.data);
                    this.close();
                });

            } else {

            }
        });


    }

}
