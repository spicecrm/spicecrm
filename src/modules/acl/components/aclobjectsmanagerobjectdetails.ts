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
    OnInit
} from '@angular/core';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {view} from '../../../services/view.service';
import {metadata} from '../../../services/metadata.service';
import {backend} from '../../../services/backend.service';

@Component({
    selector: 'aclobjects-manager-object-details',
    templateUrl: './src/modules/acl/templates/aclobjectsmanagerobjectdetails.html',
    providers: [view]
})
export class ACLObjectsManagerObjectDetails implements OnInit {

    private fieldset: string = '';

    private standardactions = [
        {id: 'list', action: 'LBL_LIST'},
        {id: 'listrelated', action: 'LBL_LISTRELATED'},
        {id: 'view', action: 'LBL_VIEW'},
        {id: 'editrelated', action: 'LBL_EDITRELATION'},
        {id: 'edit', action: 'LBL_EDIT'},
        {id: 'create', action: 'LBL_CREATE'},
        {id: 'deleterelated', action: 'LBL_REMOVERELATION'},
        {id: 'delete', action: 'LBL_DELETE'},
        {id: 'export', action: 'LBL_EXPORT'},
        {id: 'import', action: 'LBL_IMPORT'},
        {id: 'massupdate', action: 'LBL_MASSUPDATE'}
        // {id: 8, action: 'LBL_REASSIGN'},
        // {id: 9, action: 'LBL_CHANGE_TERRITORY'}
    ];

    private objectactions = [];

    constructor(private view: view, private metadata: metadata, private model: model, private language: language, private backend: backend) {
        this.view.isEditable = true;
        this.view.setEditMode();

        // get the config
        let componentconfig = this.metadata.getComponentConfig('ACLObjectsManagerObjectDetails', 'SpiceACLObjects');
        this.fieldset = componentconfig.fieldset;
    }

    public ngOnInit() {
        this.backend.getRequest('spiceaclobjects/authtypes/' + this.model.getFieldValue('sysmodule_id') + '/authtypeactions').subscribe(objectactions => {
            this.objectactions = objectactions;
        });
    }

    get showActions() {
        return this.model.getFieldValue('spiceaclobjecttype') == '0' || this.model.getFieldValue('spiceaclobjecttype') == '3';
    }

    private getActionValue(actionid) {
        let objectactions = this.model.getFieldValue('objectactions');

        for (let objectaction of objectactions) {
            if (objectaction.spiceaclaction_id == actionid) {
                return true;
            }
        }

        return false;
    }

    private setActionValue(actionid, event) {
        // stop propagation
        event.preventDefault();

        // search for the value
        let objectactions = this.model.getFieldValue('objectactions');
        let i = 0;
        for (let objectaction of objectactions) {
            if (objectaction.spiceaclaction_id == actionid) {
                objectactions.splice(i, 1);
                this.model.setField('objectactions', objectactions);
                return;
            }
            i++;
        }

        // if not found add it
        objectactions.push({
            spiceaclobject_id: this.model.id,
            spiceaclaction_id: actionid
        });

    }
}
