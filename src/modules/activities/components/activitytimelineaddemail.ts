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
    templateUrl: '../templates/activitytimelineaddemail.html',
    providers: [model, view]
})
export class ActivityTimelineAddEmail extends ActivityTimelineAddItem implements OnInit {
    /**
     * holds the fieldset fields
     */
    public formFields: any[] = [];
    /**
     * holds the fieldset id
     */
    public formFieldSet: string = '';
    /**
     * holds the headerfieldset id
     */
    public headerFieldSet: string = '';

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
        public session: session
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
    public initializeEmail() {

        this.model.id = this.model.generateGuid();
        this.model.initializeModel();
        this.model.startEdit();

        // set the parent data
        this.model.setFields({
            parent_type: this.activitiytimeline.parent.module,
            parent_id: this.activitiytimeline.parent.id,
            parent_name: this.activitiytimeline.parent.getField('summary_text'),
            type: 'out',
            status:'created',
            recipient_addresses: [],
            from_addr_name: this.session.authData.email
        });
    }

    /**
     * the trigger when the header fieldset or any item therein in focused and the item is expanded
     */
    public onHeaderClick() {
        if (!this.isExpanded) {
            this.isExpanded = true;
            this.initializeEmail();

            // set start editing here as well so we can block navigating away
            this.model.startEdit(false);
        }
    }

    public subscribeParent() {
        this.activitiytimeline.parent.data$.subscribe(data => {
            if (this.model.getField('recipient_addresses')?.length == 0) {
                this.determineRecipientAddress();
            }
            // if we still have the same model .. update
            if (data.id == this.model.getField('parent_id')) {
                this.model.setField('parent_name', data.summary_text);
            }
        });
    }

    /**
     * set view edit mode
     */
    public setEditMode() {
        this.view.isEditable = true;
        this.view.setEditMode();
    }

    /**
     * get fieldset fields
     */
    public getFieldsetFields() {
        let conf = this.metadata.getComponentConfig('ActivityTimelineAddEmail', this.model.module);
        this.formFieldSet = conf.fieldset;
        this.headerFieldSet = conf.headerfieldset;
        this.formFields = this.metadata.getFieldSetItems(conf.fieldset);
    }

    /**
     * expand the panel and initialize the email model
     */
    public onFocus() {
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
    public determineRecipientAddress() {
        if (this.activitiytimeline.parent.getField('email1')) {
            this.model.setField('recipient_addresses', [{
                parent_type: this.activitiytimeline.parent.module,
                parent_id: this.activitiytimeline.parent.id,
                email_address: this.activitiytimeline.parent.getField('email1'),
                id: this.model.generateGuid(),
                address_type: 'to'
            }]);
        }
    }

    /**
     * attempt to send the email and prompt the user if the subject and body are empty
     */
    public send() {
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
    public save() {
        this.model.setField('to_be_sent', true);
        this.model.save().subscribe(() => {
            this.isExpanded = false;
            this.model.setField('to_be_sent', false);
            this.initializeEmail();
            this.determineRecipientAddress();
            this.model.endEdit();
        });
    }
}
