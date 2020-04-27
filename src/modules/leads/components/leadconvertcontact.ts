/**
 * @module ModuleLeads
 */
import {
    Component, Input, Output, EventEmitter, AfterViewInit, ViewChild, ViewContainerRef,
    OnInit
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

    @Input() public lead: model = undefined;
    @Output() public contact: EventEmitter<model> = new EventEmitter<model>();

    public initialized: boolean = false;
    public componentSet: string = '';
    public componentconfig: any = {};
    public componentRefs: any = [];

    constructor(private view: view, private metadata: metadata, private model: model) {
        this.model.module = 'Contacts';
        this.model.initializeModel();

        this.view.isEditable = true;
        this.view.setEditMode();
    }

    public ngOnInit() {
        // console.log(this.model.data);

        this.lead.data$.subscribe(data => {

            this.model.data.degree1 = data.degree1;
            this.model.data.degree2 = data.degree2;
            this.model.data.first_name = data.first_name;
            this.model.data.last_name = data.last_name;
            this.model.data.salutation = data.salutation;
            this.model.data.title_dd = data.title_dd;
            this.model.data.title = data.title;
            this.model.data.department = data.department;
            this.model.data.email1 = data.email1;
            // SPICE-276 form is now using multiple e-mail address field type
            if( data.emailaddresses) {
                for (let item of this.model.data.emailaddresses) {
                    item.email_address = data.email1;
                }
            }

            // this.model.data.emailaddresses = data.emailaddresses;
            this.model.data.phone_work = data.phone_work;
            this.model.data.phone_mobile = data.phone_mobile;
            this.model.data.phone_fax = data.phone_fax;

            if ( data.business_sector ) this.model.data.business_sector = data.business_sector;
            if ( data.business_topic ) this.model.data.business_topic = data.business_topic;

            this.model.data.primary_address_street = data.primary_address_street;
            this.model.data.primary_address_city = data.primary_address_city;
            this.model.data.primary_address_postalcode = data.primary_address_postalcode;
            this.model.data.primary_address_state = data.primary_address_state;
            this.model.data.primary_address_country = data.primary_address_country;
            this.model.data.primary_address_attn = data.primary_address_attn;

        });
        // emit the model
        this.contact.emit(this.model);
    }

    public ngAfterViewInit() {
        this.initialized = true;
        this.buildContainer();
    }

    public buildContainer() {
        // Close any already open dialogs
        // this.container.clear();
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


}
