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
 * @module ObjectComponents
 */

/**
 * @ignore
 */
declare var moment: any;

import {Component} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {language} from '../../services/language.service';
import {modellist} from '../../services/modellist.service';
import {modal} from '../../services/modal.service';

/**
 * renders a modal dialog to let the user choose the fields to be exported. By default it is the fields in the view
 *
 * per componentconfig also all fields can be enabled or a specific fieldset
 */
@Component({
    templateUrl: './src/objectcomponents/templates/objectlistheaderactionsexportcsvselectfields.html',
})
export class ObjectListHeaderActionsExportCSVSelectFields {

    /**
     * reference to the modal itself
     */
    private self: any;

    private multiselect: boolean = true;
    private selectedAvailableFields: any[] = [];
    private selectedListFields: any[] = [];
    private availableFields: any[] = [];
    private exportFields: any[] = [];

    constructor(
        private language: language,
        private metadata: metadata,
        private model: model,
        private modellist: modellist,
        private modal: modal
    ) {

        // get the current last fields
        // this.exportFields = [...this.modellist.lastFields];
        this.exportFields = [];
        for(let field of this.modellist.listfields){
            this.exportFields.push(field.field);
        }


        // get all module fields
        let componentConfig = this.metadata.getComponentConfig('ObjectListHeaderActionsExportCSVSelectFields', this.model.module);
        if (componentConfig.enableall) {
            let fields = this.metadata.getModuleFields(this.model.module);
            for (let field in fields) {
                if (this.isExportable(fields[field]) && this.exportFields.indexOf(field) == -1) this.availableFields.push(field);
            }
        } else if (componentConfig.fieldset) {
            let fields = this.metadata.getFieldSetFields(componentConfig.fieldset);
            for (let field of fields) {
                if (this.isExportable(field) && this.exportFields.indexOf(field.field) == -1) this.availableFields.push(field.field);
            }
        } else {
            // get the default fields
            let componentconfig = this.metadata.getComponentConfig('ObjectList', this.modellist.module);
            let fields = this.metadata.getFieldSetFields(componentconfig.fieldset);
            for (let field of fields) {
                if (this.isExportable(field) && this.exportFields.indexOf(field.field) == -1) this.availableFields.push(field.field);
            }
        }
        this.sortAvailableFields();
    }

    /**
     * dos ome checks fi the field can be exported
     *
     * no links, .. check on other fields tbd.
     *
     * @param field the fieldmetadata
     */
    private isExportable(field) {
        return field.type != 'link';
    }

    /**
     * handle thje drop event
     *
     * @param event
     */
    private onFieldDrop(event) {
        let previousItem = event.previousContainer.data.splice(event.previousIndex, 1);
        event.container.data.splice(event.currentIndex, 0, previousItem[0]);
    }

    /*
     select the field whenc lciked int he container
     */
    private selectField(container, field) {
        switch (container) {
            case 'available':
                if (this.multiselect === false) {
                    this.selectedAvailableFields = [field];
                } else {
                    if (this.selectedAvailableFields.indexOf(field) >= 0) {
                        this.selectedAvailableFields.splice(this.selectedAvailableFields.indexOf(field), 1);
                    } else {
                        this.selectedAvailableFields.push(field);
                    }
                }
                break;
            case 'list':
                if (this.multiselect === false) {
                    this.selectedListFields = [field];
                } else {
                    if (this.selectedListFields.indexOf(field) >= 0) {
                        this.selectedListFields.splice(this.selectedListFields.indexOf(field), 1);
                    } else {
                        this.selectedListFields.push(field);
                    }
                }
                break;
        }
    }

    /*
     function to set the aria-selected attr on a field
     */
    private isSelected(container, field) {
        switch (container) {
            case 'available':
                return this.selectedAvailableFields.indexOf(field) >= 0;
            case 'list':
                return this.selectedListFields.indexOf(field) >= 0;
        }
    }

    /*
     move selected field to the othe container
     */
    private moveFields(fromContainer) {
        switch (fromContainer) {
            case 'available':
                this.selectedAvailableFields.forEach((item) => {
                    this.availableFields.some((targetitem, targetindex) => {
                        if (item == targetitem) {
                            this.exportFields.push(this.availableFields.splice(targetindex, 1)[0]);
                            return true;
                        }
                    });
                });
                this.selectedAvailableFields = [];
                break;
            case 'list':
                this.selectedListFields.forEach((item) => {
                    this.exportFields.some((targetitem, targetindex) => {
                        if (item == targetitem) {
                            this.availableFields.push(this.exportFields.splice(targetindex, 1)[0]);
                            return true;
                        }
                    });
                });
                this.selectedListFields = [];
                this.sortAvailableFields();
                break;
        }
    }

    private sortAvailableFields() {
        this.availableFields = this.availableFields.sort((a, b) => {
            return this.language.getFieldDisplayName(this.model.module, a).toLowerCase() > this.language.getFieldDisplayName(this.model.module, b).toLowerCase() ? 1 : -1;
        });
    }

    /**
     * cancel and close the dialog
     */
    public cancel() {
        this.self.destroy();
    }

    public export() {
        this.modal.openModal('SystemLoadingModal').subscribe(loadingRef => {
            loadingRef.instance.messagelabel = 'LBL_EXPORTING';
            this.modellist.exportList(this.exportFields).subscribe(downloadurl => {
                loadingRef.instance.self.destroy();

                // handle the download
                let a: any = document.createElement("a");
                document.body.appendChild(a);
                a.href = downloadurl;
                a.download = this.model.module + '_' + new moment().format('YYYY_MM_DD_HH_mm') + '.csv';
                a.click();
                a.remove();

                // destroy the modal itself
                this.self.destroy();

            });
        });
    }

}

