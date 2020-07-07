/**
 * @module ModuleActivities
 */
import {Component, ElementRef, OnInit, Renderer2, ViewContainerRef} from '@angular/core';
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

    public fromEmails: any[] = [];
    private formFields: any[] = [];
    private fromInbox: string = '';
    private formFieldSet: string = '';
    private isInitialized: boolean = false;

    constructor(
        public metadata: metadata,
        public elementRef: ElementRef,
        public renderer: Renderer2,
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

    public get firstFormField() {
        return this.formFields.filter((item, index) => index === 0);
    }

    /**
     * checks if the email can be sent
     */
    get canSend() {
        let receipientaddresses = this.model.getField('recipient_addresses');
        return receipientaddresses ? receipientaddresses.some(r => r.address_type == 'to') : false;
    }

    public ngOnInit() {
        this.initializeEmail();
        this.subscribeParent();
        this.setEditMode();
        this.getFields();
    }

    private initializeEmail() {
        this.isInitialized = true;
        this.model.module = 'Emails';
        // SPICEUI-2
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
            if (this.model.data.recipient_addresses.length == 0) {
                this.determineToAddr();
            }
            // if we still have the same model .. update
            if (data.id == this.model.data.parent_id) {
                this.model.data.parent_name = data.summary_text;
            }
        });
    }

    private setEditMode() {
        this.view.isEditable = true;
        this.view.setEditMode();
    }

    private getFields() {
        let conf = this.metadata.getComponentConfig('ActivityTimelineAddEmail', this.model.module);
        this.formFieldSet = conf.fieldset;
        this.formFields = this.metadata.getFieldSetItems(conf.fieldset);
    }

    private onFocus() {
        if (!this.isInitialized) {
            this.determineToAddr();

            this.backend.getRequest('EmailManager/outbound').subscribe(data => {
                if (data.length > 0) {
                    for (let entry of data) {
                        this.fromEmails.push(entry);
                    }
                    this.fromInbox = data[0].id;
                }
            });
        }
        this.isExpanded = true;
    }

    private determineToAddr() {
        // see if we have an email from the parent
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
     * attepmt to send the email and prompüt the user if the subject and body is empty
     */
    private send() {
        if (this.canSend) {
            if (!this.model.getField('name') && !this.model.getField('body')) {
                this.modal.prompt("confirm", this.language.getLabel('LBL_EMAIL_SEND_EMPTY', null, 'long'), this.language.getLabel('LBL_EMAIL_SEND_EMPTY')).subscribe(resp => {
                    if (resp) {
                        this.doSend();
                    }
                });
            } else {
                this.doSend();
            }
        }
    }

    /**
     * save and send the email
     */
    private doSend() {
        this.model.data.to_be_sent = true;
        this.save();
    }

    private save() {
        this.model.save().subscribe(data => {
            this.isExpanded = false;
            this.model.data.to_be_sent = false;
            this.initializeEmail();
            this.determineToAddr();
            this.model.endEdit();
        });
    }
}
