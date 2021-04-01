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
 * @module ModuleACL
 */
import {
    Component,
} from '@angular/core';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {modal} from '../../../services/modal.service';

/**
 * manages the fisl control settings on an ACL Object
 */
@Component({
    selector: 'aclobjects-manager-object-fields',
    templateUrl: './src/modules/acl/templates/aclobjectsmanagerobjectfields.html'
})
export class ACLObjectsManagerObjectFields {

    constructor(private modal: modal, private model: model, private language: language) {

    }

    /**
     * a getter for the fields athat are defined
     */
    get fields() {
        let fieldsArray = [];

        let fields = this.model.getFieldValue('fieldcontrols');
        if (fields) {
            for (let field of fields) {
                fieldsArray.push(field);
            }
        }

        return fieldsArray;
    }

    /**
     * loads the field controls
     */
    get showFieldControls() {
        return this.model.getFieldValue('spiceaclobjecttype') == '0' || this.model.getFieldValue('spiceaclobjecttype') == '3';
    }

    /**
     * gets the field control set on the object
     *
     * @param field the name of the field
     */
    private getFieldControl(field) {
        let fields = this.model.getFieldValue('fieldcontrols');
        for (let thisfield of fields) {
            if (thisfield.field == field) {
                return thisfield.control;
            }
        }
        return '';
    }

    /**
     * sets the field control value
     *
     * @param field fieldname
     * @param event the event
     */
    private setFieldControl(field, event) {
        let fields = this.model.getFieldValue('fieldcontrols');
        for (let thisfield of fields) {
            if (thisfield.field == field) {
                thisfield.control = event.currentTarget.value;
            }
        }

    }

    /**
     * handles the rmoval fo a field
     *
     * @param field the name fo the field
     */
    private removeField(field) {
        let fields = this.model.getFieldValue('fieldcontrols');
        let i = 0;
        for (let thisfield of fields) {
            if (thisfield.field == field) {
                fields.splice(i, 1);
                this.model.setField('fieldcontrols', fields);
                return;
            }
            i++;
        }
    }

    /**
     * called to add a Field
     */
    private addField() {
        let module = this.model.getFieldValue('spiceacltype_module');
        let currentFields = [];
        let fields = this.model.getFieldValue('fieldcontrols');
        for (let thisfield of fields) {
            currentFields.push({name: thisfield.field, id: thisfield.id});
        }

        this.modal.openModal('ACLTypesManagerTypesAddFields').subscribe(modalRef => {
            modalRef.instance.module = module;
            modalRef.instance.currentfields = currentFields;

            // set showAll so also links and noin-db fields are shown
            modalRef.instance.showAll = true;

            modalRef.instance.addfields.subscribe(fields => {
                if (fields) {
                    let currentfields = this.model.getFieldValue('fieldcontrols');

                    let newFields = [];

                    // check if fields are already in currentfields -> YES: let them like they are -> NO: add new field
                    for (let sfield of fields) {
                        let already_selected = false;
                        for (let key in currentfields) {
                            if(currentfields[key].field == sfield) {
                                already_selected = true;
                                newFields.push(currentfields[key]);
                            }
                        }
                        if(!already_selected) {
                            newFields.push({spiceaclobject_id: this.model.id, field: sfield, control: 1});
                        }
                    }
                    currentfields = newFields;
                    this.model.setField('fieldcontrols', currentfields);
                }
            });
        });
    }
}
