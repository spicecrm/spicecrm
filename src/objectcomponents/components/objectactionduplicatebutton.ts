/*
SpiceUI 2021.01.001

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
import {Component, OnInit, SkipSelf} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {session} from '../../services/session.service';
import {language} from '../../services/language.service';

@Component({
    selector: 'object-action-duplicate-button',
    templateUrl: './src/objectcomponents/templates/objectactionduplicatebutton.html',
    providers: [model]
})
export class ObjectActionDuplicateButton {

    constructor(@SkipSelf() private parent: model, private language: language, private metadata: metadata, private model: model, private session: session) {

    }
    /**
     * hide the button while the model is editing
     */
    get hidden() {
        return this.model.isEditing;
    }

    /**
     * set to dsiabled when we are not allowed to edit or we are editing or saving already
     */
    get disabled() {
        if (!this.metadata.checkModuleAcl(this.parent.module, 'create')) {
            return true;
        }
        return this.parent.isEditing || this.parent.isSaving;
    }

    public execute() {
        let newId = this.model.utils.generateGuid();
        this.model.module = this.parent.module;
        this.model.id = newId;
        this.model.isNew = true;
        this.model.data = JSON.parse(JSON.stringify(this.parent.data));
        this.model.data.id = newId;
        this.model.data.assigned_user_id = this.session.authData.userId;
        this.model.data.assigned_user_name = this.session.authData.userName;
        this.model.data.modified_by_id = this.session.authData.userId;
        this.model.data.modified_by_name = this.session.authData.userName;
        this.model.data.date_entered = new Date();
        this.model.data.date_modified = new Date();

        for (let field in this.parent.fields) {
            if (this.parent.fields[field].type == 'link' && this.model.data[field] && this.model.data[field].beans) {
                for (let bean in this.model.data[field].beans) {
                    for (let relField in this.model.data[field].beans[bean]) {
                        if (this.model.data[field].beans[bean][relField] == this.parent.id) {
                            this.model.data[field].beans[bean][relField] = newId;
                            this.model.data[field].beans[bean].id = this.model.utils.generateGuid();
                        }

                        // max 1 level
                        if (this.model.data[field].beans[bean][relField].beans) {
                            this.model.data[field].beans[bean][relField].beans = {};
                        }
                    }

                    if (this.model.data[field].beans[bean].id != bean) {
                        this.model.data[field].beans[this.model.data[field].beans[bean].id] = this.model.data[field].beans[bean];
                        delete(this.model.data[field].beans[bean]);
                    }
                }
            }
        }

        // set as duplicate
        this.model.duplicate = true;
        this.model.templateId = this.parent.id;

        this.model.edit();
    }
}
