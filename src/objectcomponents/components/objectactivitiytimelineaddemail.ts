/**
 * @module ObjectComponents
 */
import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {modal} from '../../services/modal.service';
import {backend} from '../../services/backend.service';
import {session} from '../../services/session.service';
import {activitiyTimeLineService} from '../../services/activitiytimeline.service';

@Component({
    selector: 'object-activitiytimeline-add-email',
    templateUrl: './src/objectcomponents/templates/objectactivitytimelineaddemail.html',
    providers: [model, view]
})
export class ObjectActivitiyTimelineAddEmail implements OnInit {

    public fromEmails: any[] = [];
    private formFields: any[] = [];
    private fromInbox: string = '';
    private formFieldSet: string = '';
    private isExpanded: boolean = false;
    private isInitialized: boolean = false;

    constructor(private metadata: metadata,
                private activitiyTimeLineService: activitiyTimeLineService,
                private model: model, private view: view,
                private language: language,
                private session: session,
                private backend: backend,
                private modal: modal,
                private ViewContainerRef: ViewContainerRef) {
    }

    public get firstFormField() {
        return this.formFields.filter((item, index) => index === 0);
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

        // set the parent data
        this.model.data.parent_type = this.activitiyTimeLineService.parent.module;
        this.model.data.parent_id = this.activitiyTimeLineService.parent.id;
        this.model.data.parent_name = this.activitiyTimeLineService.parent.data.summary_text;

        this.model.data.type = 'out';
        this.model.data.status = 'created';

        // set sender and recipients
        this.model.data.recipient_addresses = [];
        this.model.data.from_addr_name = this.session.authData.email;
    }

    private subscribeParent() {
        this.activitiyTimeLineService.parent.data$.subscribe(data => {
            if (this.model.data.recipient_addresses.length == 0) {
                this.determineToAddr();
            }
            // if we still have the same model .. update
            if (data.id == this.model.data.parent_id)
                this.model.data.parent_name = data.summary_text;
        });
    }

    private setEditMode() {
        this.view.isEditable = true;
        this.view.setEditMode();
    }

    private getFields() {
        let conf = this.metadata.getComponentConfig('ObjectActivitiyTimelineAddEmail', this.model.module);
        this.formFieldSet = conf.fieldset;
        this.formFields = this.metadata.getFieldSetFields(conf.fieldset);
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
        if (this.activitiyTimeLineService.parent.data.email1) {
            this.model.data.recipient_addresses = [{
                parent_type: this.activitiyTimeLineService.parent.module,
                parent_id: this.activitiyTimeLineService.parent.id,
                email_address: this.activitiyTimeLineService.parent.data.email1,
                id: this.model.generateGuid(),
                address_type: 'to'
            }];
        }
    }

    private cancel() {
        this.isExpanded = false;
    }

    private send() {
        this.model.data.to_be_sent = true;
        this.save();
    }

    private save() {
        this.model.save().subscribe(data => {
            this.isExpanded = false;
            this.model.data.to_be_sent = false;
            this.initializeEmail();
            this.determineToAddr();
        });
    }

    private expand() {
        this.modal.openModal('GlobalDockedComposerModal', true, this.ViewContainerRef.injector);
    }
}