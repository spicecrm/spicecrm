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
 * @module ModuleKnowledge
 */
import {Component} from "@angular/core";
import {backend} from "../../../services/backend.service";
import {language} from "../../../services/language.service";
import {model} from "../../../services/model.service";
import {modal} from "../../../services/modal.service";
import {toast} from "../../../services/toast.service";
import {KnowledgeService} from "../services/knowledge.service";

@Component({
    selector: 'knowledge-browser',
    templateUrl: "./src/modules/knowledge/templates/knowledgereleaseallbutton.html"
})
export class KnowledgeReleaseAllButton {

    public disabled: boolean = true;

    constructor(private language: language,
                private model: model,
                private modal: modal,
                private toast: toast,
                private knowledgeService: KnowledgeService,
                private backend: backend) {
    }

    public ngOnInit() {
        this.handleDisabled(this.model.isEditing ? 'edit' : 'display');
        this.model.mode$.subscribe(mode => {
            this.handleDisabled(mode);
        });

        this.model.data$.subscribe(data => {
            this.handleDisabled(this.model.isEditing ? 'edit' : 'display');
        });
    }

    public execute() {
        this.modal.confirm(this.language.getLabel('MSG_RELEASE_ALL_CONFIRM'), this.language.getLabel('LBL_RELEASE_ALL')).subscribe(answer => {
            if (answer) {
                this.backend.postRequest(`module/KnowledgeDocument/${this.model.id}/release/all`).subscribe(
                    res => {
                        if (res && res.released) {
                            this.model.setField('status', 'Released');
                            this.knowledgeService.documentsList.forEach(doc => {
                                if (doc.id == this.model.id || res.ids[doc.id]) {
                                    doc.name = doc.name.replace(/\(.*\)/g, '') + ' (Released)';
                                    doc.status = 'Released';
                                }
                            } );
                            this.toast.sendToast(this.language.getLabel('MSG_SUCCESSFULLY_EXECUTED'), 'success');
                        }
                    },
                    err => this.toast.sendToast(this.language.getLabel('ERR_FAILED_TO_EXECUTE'), 'error'));
            }
        });
    }

    private handleDisabled(mode) {
        if (this.model.getFieldValue('status') != 'Draft') {
            return this.disabled = true;
        }
        if (this.model.data.acl && !this.model.checkAccess('edit')) {
            return this.disabled = true;
        }
        this.disabled = mode == 'edit';
    }
}
