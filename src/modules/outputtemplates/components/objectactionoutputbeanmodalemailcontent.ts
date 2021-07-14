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
import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {model} from '../../../services/model.service';
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';
import {modal} from "../../../services/modal.service";
import {view} from "../../../services/view.service";
import {session} from "../../../services/session.service";

@Component({
    selector: 'object-action-output-bean-modal-email-content',
    templateUrl: './src/modules/outputtemplates/templates/objectactionoutputbeanmodalemailcontent.html',
    providers: [view, model]
})
export class ObjectActionOutputBeanModalEmailContent implements OnChanges {

    /**
     * the fieldset
     */
    @Input() public fieldset: any = null;

    /**
     * the filelist
     */
    @Input() public filelist: any = {};

    /**
     * the content for the attachment
     */
    @Input() public attachmentContent: string;

    /**
     * the parent model
     */
    @Input() public parent: any = {};

    /**
     * email sent
     */
    @Output() public email_sent: EventEmitter<string> = new EventEmitter<string>();

    /**
     * reference to the dynamic aded compontent
     *
     * @private
     */
    private attachmentsPanelRef: any;

    /**
     * inidcates that we are sending
     */
    private sending: boolean = false;

    constructor(
        private language: language,
        private model: model,
        private metadata: metadata,
        private modal: modal,
        private view: view,
        private session: session
    ) {
    }

    public ngOnInit() {
        this.setModelData();
        this.setViewData();
    }

    public ngOnChanges(changes: SimpleChanges) {
        if (changes.filelist) {
            if (this.attachmentsPanelRef) {
                this.attachmentsPanelRef.instance.setUploadFiles(this.filelist);
            }
        }
    }

    /**
     * set all email-model data
     * set copy rules from parent
     */
    private setModelData() {
        this.model.module = "Emails";

        this.model.initialize(this.parent);
        this.model.data.parent_type = this.parent.module;
        this.model.data.parent_id = this.parent.data.id;
        this.model.data.parent_name = this.parent.data.name;
        this.model.isNew = true;
        this.model.data.assigned_user_id = this.session.authData.userId;
        this.model.data.assigned_user_name = this.session.authData.userName;
        this.model.data.modified_by_id = this.session.authData.userId;
        this.model.data.modified_by_name = this.session.authData.userName;
        this.model.data.date_entered = new Date();
        this.model.data.date_modified = new Date();
        this.model.startEdit();
    }

    /**
     * if it is allowed: go to edit mode
     */
    private setViewData() {
        this.view.setEditMode();
        this.view.isEditable = true;
    }


    public sendEmail() {
        this.modal.openModal('SystemLoadingModal', false).subscribe(modalRef => {
            modalRef.instance.messagelabel = 'LBL_SENDING';

            this.sending = true;
            this.model.setField('type', 'out');
            this.model.setField('to_be_sent', '1');
            this.model.setField('from_addr', this.model.data.from_addr_name);
            this.model.setField('to_addrs', this.model.data.to_addrs_names);

            this.model.save().subscribe(
                success => {
                    modalRef.instance.self.destroy();
                    // emit that the email has been sent
                    this.email_sent.emit();
                },
                error => {
                    modalRef.instance.self.destroy();
                    this.sending = false;
                }
            );
        });
    }
}
