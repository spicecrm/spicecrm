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
    Component
} from '@angular/core';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {view} from '../../../services/view.service';
import {metadata} from '../../../services/metadata.service';
import {backend} from '../../../services/backend.service';
import {modelutilities} from '../../../services/modelutilities.service';

@Component({
    selector: 'aclobjects-manager-object-fieldvalues',
    templateUrl: './src/modules/acl/templates/aclobjectsmanagerobjectfieldvalues.html',
    providers: [view]
})
export class ACLObjectsManagerObjectFieldvalues {

    private fields: any[] = [];
    private fieldset: string = '';
    private loadedtype: string = '';

    constructor(private backend: backend, private view: view, private metadata: metadata, private model: model, private language: language, private modelutilities: modelutilities) {
        this.view.isEditable = true;
        this.view.setEditMode();

        this.handleType();

        // get the config
        let componentconfig = this.metadata.getComponentConfig('ACLObjectsManagerObjectFieldvalues', 'SpiceACLObjects');
        this.fieldset = componentconfig.fieldset;
    }

    private handleType() {
        let aclTypeId = this.model.getFieldValue('sysmodule_id');
        if (aclTypeId && this.loadedtype != aclTypeId) {
            this.loadedtype = aclTypeId;
            // get the fields
            this.backend.getRequest('module/SpiceACLObjects/modules/' + aclTypeId).subscribe(typedata => {
                this.fields = typedata.authtypefields;
            });
        }
    }

    private getFieldValue(field, valueid) {
        let fieldValues = this.model.getFieldValue('fieldvalues');
        if (fieldValues && fieldValues.length > 0) {
            for (let fieldvalue of fieldValues) {
                if (fieldvalue.spiceaclmodulefield_id == valueid) {
                    return fieldvalue[field];
                }
            }
        }

        return '';
    }

    private setFieldValue(field, valueid, eventtype, event) {
        let fieldValues = this.model.getFieldValue('fieldvalues');
        if (fieldValues && fieldValues.length > 0) {
            for (let fieldvalue of fieldValues) {
                if (fieldvalue.spiceaclmodulefield_id == valueid) {
                    fieldvalue[field] = event.currentTarget.value;
                    return;
                }
            }
        }

        // not found .. add new object entry
        let newObject = {
            spiceaclobject_id: this.model.id,
            spiceaclmodulefield_id: valueid,
            operator: '',
            value1: '',
            value2: ''
        };
        newObject[field] = event.currentTarget.value;
        fieldValues.push(newObject);
    }

    private resetid(valueid) {
        let i = 0;
        let fieldValues = this.model.getFieldValue('fieldvalues');
        if (fieldValues && fieldValues.length > 0) {
            for (let fieldvalue of fieldValues) {
                if (fieldvalue.spiceaclmodulefield_id == valueid) {
                    fieldValues.splice(i, 1);
                    return;
                }
                i++;
            }
        }
    }

}
