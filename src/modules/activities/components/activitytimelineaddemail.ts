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
 * @module ModuleActivities
 */
import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {modal} from '../../../services/modal.service';
import {backend} from '../../../services/backend.service';
import {session} from '../../../services/session.service';
import {dockedComposer} from '../../../services/dockedcomposer.service';
import {activitiytimeline} from '../../../services/activitiytimeline.service';
import {ActivityTimelineAddItem} from "./activitytimelineadditem";

@Component({
    selector: 'activitytimeline-add-email',
    templateUrl: './src/modules/activities/templates/activitytimelineaddemail.html',
    providers: [model, view]
})
export class ActivityTimelineAddEmail extends ActivityTimelineAddItem implements OnInit {
    /**
     * holds the fieldset fields
     */
    protected formFields: any[] = [];
    /**
     * holds the fieldset id
     */
    private formFieldSet: string = '';

    constructor(
        public metadata: metadata,
        public activitiytimeline: activitiytimeline,
        public model: model,
        public view: view,
        public language: language,
        public modal: modal,
        public dockedComposer: dockedComposer,
        public ViewContainerRef: ViewContainerRef,
        public backend: backend,
        private session: session
    ) {
        super(metadata, activitiytimeline, model, view, language, modal, dockedComposer, ViewContainerRef);
    }

    /**
     * checks if the email can be sent
     */
    get canSend() {
        let receipientaddresses = this.model.getField('recipient_addresses');
        return receipientaddresses ? receipientaddresses.some(r => r.address_type == 'to') : false;
    }

    /**
     * subscribe to parent
     * get fieldset fields
     */
    public ngOnInit() {
        this.model.module = 'Emails';
        this.setEditMode();
        this.subscribeParent();
        this.getFieldsetFields();
    }

    /**
     * initialize email model
     */
    private initializeEmail() {

        this.model.id = this.model.generateGuid();
        this.model.initializeModel();
        this.model.startEdit();

        // set the parent data
        this.model.data.parent_type = this.activitiytimeline.parent.module;
        this.model.data.parent_id = this.activitiytimeline.parent.id;
        this.model.data.parent_name = this.activitiytimeline.parent.data.summary_text;

        this.model.data.type = 'out';
        this.model.data.status = 'created';

        // set sender and recipients
        this.model.data.recipient_addresses = [];
        this.model.data.from_addr_name = this.session.authData.email;
    }

    private subscribeParent() {
        this.activitiytimeline.parent.data$.subscribe(data => {
            if (this.model.data.recipient_addresses?.length == 0) {
                this.determineRecipientAddress();
            }
            // if we still have the same model .. update
            if (data.id == this.model.data.parent_id) {
                this.model.data.parent_name = data.summary_text;
            }
        });
    }

    /**
     * set view edit mode
     */
    private setEditMode() {
        this.view.isEditable = true;
        this.view.setEditMode();
    }

    /**
     * get fieldset fields
     */
    private getFieldsetFields() {
        let conf = this.metadata.getComponentConfig('ActivityTimelineAddEmail', this.model.module);
        this.formFieldSet = conf.fieldset;
        this.formFields = this.metadata.getFieldSetItems(conf.fieldset);
    }

    /**
     * expand the panel and initialize the email model
     */
    private onFocus() {
        if(!this.isExpanded) {
            this.isExpanded = true;
            this.initializeEmail();
            this.determineRecipientAddress();
            this.setEditMode();
        }
    }

    /**
     * determine recipient address from parent
     */
    private determineRecipientAddress() {
        if (this.activitiytimeline.parent.data.email1) {
            this.model.data.recipient_addresses = [{
                parent_type: this.activitiytimeline.parent.module,
                parent_id: this.activitiytimeline.parent.id,
                email_address: this.activitiytimeline.parent.data.email1,
                id: this.model.generateGuid(),
                address_type: 'to'
            }];
        }
    }

    /**
     * attempt to send the email and prompt the user if the subject and body are empty
     */
    private send() {
        if (!this.canSend) return;
        if (!this.model.getField('name') && !this.model.getField('body')) {
            this.modal.prompt(
                "confirm",
                this.language.getLabel('LBL_EMAIL_SEND_EMPTY', null, 'long'),
                this.language.getLabel('LBL_EMAIL_SEND_EMPTY')
            ).subscribe(resp => {
                if (resp) {
                    this.save();
                }
            });
        } else {
            this.save();
        }
    }

    /**
     * save the email and reinitialize the email model
     */
    private save() {
        this.model.data.to_be_sent = true;
        this.model.save().subscribe(() => {
            this.isExpanded = false;
            this.model.data.to_be_sent = false;
            this.initializeEmail();
            this.determineRecipientAddress();
            this.model.endEdit();
        });
    }
}
