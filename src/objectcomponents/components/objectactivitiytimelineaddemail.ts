import {AfterViewInit, Component, Input, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {modal} from '../../services/modal.service';
import {backend} from '../../services/backend.service';
import {session} from '../../services/session.service';
import {activitiyTimeLineService} from '../../services/activitiytimeline.service';
import {ObjectRelatedlistFiles} from "./objectrelatedlistfiles";

@Component({
    selector: 'object-activitiytimeline-add-email',
    templateUrl: './src/objectcomponents/templates/objectactivitytimelineaddemail.html',
    providers: [model, view]
})
export class ObjectActivitiyTimelineAddEmail implements OnInit {

    formFields: Array<any> = [];
    fromEmails: Array<any> = [];
    fromTemplates: Array<any> = [];
    fromInbox: string = '';
    fromTemplate: string = '';
    formFieldSet: string = '';
    isExpanded: boolean = false;
    isInitialized: boolean = false;

    public get firstFormField() {
        return this.formFields.filter((item, index) => index === 0)
    }

    public get moreFormFields() {
        return this.formFields.filter((item, index) => index > 0)
    }

    constructor(private metadata: metadata, private activitiyTimeLineService: activitiyTimeLineService, private model: model, private view: view, private language: language, private session: session, private backend: backend, private modal: modal, private ViewContainerRef: ViewContainerRef) {}

    ngOnInit() {
        // initialize the model
        this.initializeEmail();

        // subscribe to the parent models data Observable
        // name is not necessarily loaded
        this.activitiyTimeLineService.parent.data$.subscribe(data => {
            // if we still have the same model .. update
            if (data.id = this.model.data.parent_id)
                this.model.data.parent_name = data.summary_text;
        });

        // set view to editbale and edit mode
        this.view.isEditable = true;
        this.view.setEditMode();

        // get the fields
        let componentconfig = this.metadata.getComponentConfig('ObjectActivitiyTimelineAddEmail', this.model.module);
        this.formFieldSet   = componentconfig.fieldset;
        this.formFields     = this.metadata.getFieldSetFields(componentconfig.fieldset);
    }

    initializeEmail(){
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

        // set sender and receipients
        this.model.data.recipient_addresses = [];
        this.model.data.from_addr_name = this.session.authData.email;
    }

    determineToAddr(){
        // see if we have anemail from the parent
        if(this.activitiyTimeLineService.parent.data.email1){
            this.model.data.recipient_addresses = [{
                parent_type: this.activitiyTimeLineService.parent.module,
                parent_id: this.activitiyTimeLineService.parent.id,
                email_address: this.activitiyTimeLineService.parent.data.email1,
                id: this.model.generateGuid(),
                address_type: 'to'
            }]
        }
    }

    onFocus() {
        if(!this.isInitialized) {
            this.determineToAddr();

            this.backend.getRequest('EmailManager/outbound').subscribe(data => {
                if(data.length > 0) {
                    for (let entry of data) {
                        this.fromEmails.push(entry);
                    }
                    this.fromInbox = data[0].id;
                }
            });

        }
        this.isExpanded = true;

    }

    cancel(){
        this.isExpanded = false;
    }

    send(){
        this.model.data.to_be_sent = true;
        this.save();
    }

    save(){
        this.model.save().subscribe(data => {
            this.isExpanded = false;
            this.model.data.to_be_sent = false;
            this.initializeEmail();
            this.determineToAddr();
        });
    }

    getSenderEmailAddresses(){
        return [{
            displayname: this.session.authData.first_name + ' ' + this.session.authData.last_name + ' <' + this.session.authData.email + '>',
            email: this.session.authData.email
        }];
    }

    expand(){
        this.modal.openModal('GlobalDockedComposerModal', true, this.ViewContainerRef.injector).subscribe(componentref => {
            // componentref.instance.setModel(this.model);
        })
    }
}