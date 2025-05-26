/**
 * @module ModuleProspects
 */
import {
    Component, Input, Output, EventEmitter, AfterViewInit, ViewChild, ViewContainerRef,
    OnInit, SkipSelf, Optional
} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {telecockpitservice} from "../../telesales/services/telecockpit.service";

/**
 * renders a tab to convert the prospect to the contact
 */
@Component({
    selector: 'prospect-convert-contact',
    templateUrl: '../templates/prospectconvertcontact.html',
    providers: [view, model],
    standalone: false
})
export class ProspectConvertContact implements AfterViewInit, OnInit {
    /**
     * reference to the container where the detail view is to be rendered
     */
    @ViewChild('detailcontainer', {read: ViewContainerRef, static: true}) public detailcontainer: ViewContainerRef;

    /**
     * the emitter for the contact created or selected
     */
    @Output() public contact: EventEmitter<model> = new EventEmitter<model>();

    /**
     * a selected contact if picked from the duplicates that have been matched based on the data
     */
    public selectedContact: any = undefined;

    /**
     * the component config
     */
    public componentconfig: any = {};

    /**
     * the list of components rendered
     */
    public componentRefs: any = [];

    @Input() private module: string = 'Contacts';

    constructor(public view: view, public metadata: metadata, @SkipSelf() public prospect: model, public model: model,
                @Optional() private teleCockpit: telecockpitservice) {
        this.view.isEditable = true;
        this.view.setEditMode();
    }

    public ngOnInit() {
        this.initializeFromProspect();
    }

    public ngAfterViewInit() {
        this.buildContainer();
    }

    /**
     * initializes the contact from the prospect using the copy rules
     *
     * also links to the prospect in case the account is changed to link to the account
     */
    public initializeFromProspect() {
        this.model.module = this.module;
        this.model.id = null;
        this.model.isNew = true;
        this.model.initialize(this.prospect);

        this.model.initializeField(
            'email_addresses',
            {"beans": [{
                id: this.model.generateGuid(),
                bean_id: this.model.id,
                bean_module: this.model.module,
                email_address: this.prospect.getField('email1'),
                email_address_id: '',
                primary_address: '1'
            }]}
        );

        /**
         * subscribe to prospect changes to update the account link if set
         */
        this.prospect.data$.subscribe(data => {
            if (!this.selectedContact && (data.account_id != this.model.getField('account_id') || data.account_linked_name != this.model.getField('account_linked_name'))) {
                this.model.setFields({
                    account_id: data.account_id,
                    account_name: data.account_linked_name
                });
                // we need to pass the account as linked bean!
                // since property account_id is a related field, its value will be cleaned up
                // by the modelutilities.service in spice2backend
                this.model.initializeField(
                    'accounts',
                    {"beans": [{
                            id: this.model.getField('account_id')
                        }]}
                );
            }
        });

        /**
         * make sure we update the prospect with the link
         */
        this.model.data$.subscribe(data => {
            if(this.prospect.getField('contact_id') != data.id) {
                this.prospect.setFields({
                    contact_id: data.id
                });
            }
        });

        // emit the model
        this.contact.emit(this.model);
    }

    /**
     * builds the details container
     */
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
     * set selected contact
     * @param contactdata
     */
    public selectContact(contactdata) {
        this.selectedContact = contactdata;

        this.model.id = contactdata.id;
        this.model.isNew = false;
        this.model.setData(contactdata);
        this.view.isEditable = false;

        this.contact.emit(this.model);
    }

    /**
     * then the user unlinks the account
     */
    public unlinkContact() {
        this.selectedContact = undefined;
        this.view.isEditable = true;

        // rebuild the container
        this.buildContainer();

        this.initializeFromProspect();
    }

}
