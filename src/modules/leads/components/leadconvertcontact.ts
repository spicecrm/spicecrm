/**
 * @module ModuleLeads
 */
import {
    Component, Input, Output, EventEmitter, AfterViewInit, ViewChild, ViewContainerRef,
    OnInit, SkipSelf
} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';

@Component({
    selector: 'lead-convert-contact',
    templateUrl: './src/modules/leads/templates/leadconvertcontact.html',
    providers: [view, model]
})
export class LeadConvertContact implements AfterViewInit, OnInit {
    @ViewChild('detailcontainer', {read: ViewContainerRef, static: true}) public detailcontainer: ViewContainerRef;

    @Output() public contact: EventEmitter<model> = new EventEmitter<model>();

    public selectedContact: any = undefined;
    private createContact: boolean = true;

    public componentSet: string = '';
    public componentconfig: any = {};
    public componentRefs: any = [];

    constructor(private view: view, private metadata: metadata, @SkipSelf() private lead: model, private model: model) {

        this.view.isEditable = true;
        this.view.setEditMode();
    }

    public ngOnInit() {
        // console.log(this.model.data);
        this.initializeFromLead();

    }

    public ngAfterViewInit() {
        this.buildContainer();
    }

    private initializeFromLead() {
        this.model.module = 'Contacts';
        this.model.id = null;
        this.model.isNew = true;
        this.model.initialize(this.lead);
        this.model.initializeField(
            'emailaddresses',
            [{
                id: this.model.generateGuid(),
                bean_id: this.model.id,
                bean_module: this.model.module,
                email_address: this.lead.getField('email1'),
                email_address_id: '',
                primary_address: '1'
            }]
        );

        /**
         * subscribe to lead changes to update the account link if set
         */
        this.lead.data$.subscribe(data => {
            if (data.account_id != this.model.getField('account_id') || data.account_linked_name != this.model.getField('account_linked_name')) {
                this.model.setFields({
                    account_id: data.account_id,
                    account_name: data.account_linked_name
                });
            }
        });

        /**
         * make sure we update the lead with the link
         */
        this.model.data$.subscribe(data => {
            if(this.lead.getField('contact_id') != data.id) {
                this.lead.setFields({
                    contact_id: data.id
                });
            }
        });

        // emit the model
        this.contact.emit(this.model);
    }

    public buildContainer() {
        // Close any already open dialogs
        for (let component of this.componentRefs) {
            component.destroy();
        }

        let componentconfig = this.metadata.getComponentConfig('ObjectRecordDetails', this.model.module);
        for (let panel of this.metadata.getComponentSetObjects(componentconfig.componentset)) {
            this.metadata.addComponent(panel.component, this.detailcontainer).subscribe(componentRef => {
                componentRef.instance.componentconfig = panel.componentconfig;
                this.componentRefs.push(componentRef);
            });
        }
    }


    /**
     * when a duplicate is found and selected
     *
     * @param accountdata
     */
    private selectContact(contactdata) {
        this.selectedContact = contactdata;
        this.createContact = false;

        this.model.id = contactdata.id;
        this.model.isNew = false;
        this.model.data = this.model.utils.backendModel2spice('Contacts', contactdata);
        this.view.isEditable = false;

        this.contact.emit(this.model);
    }

    /**
     * then the user unlinks the account
     */
    private unlinkContact() {
        this.selectedContact = undefined;
        this.createContact = true;
        this.view.isEditable = true;

        // rebuild the container
        this.buildContainer();

        this.initializeFromLead();
    }

}
