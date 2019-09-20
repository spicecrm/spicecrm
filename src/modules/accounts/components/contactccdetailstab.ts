/**
 * @module ModuleAccounts
 */
import {AfterViewInit, Component, Input, OnChanges, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';

/**
 * @ignore
 */
declare var moment: any;

@Component({
    selector: 'contact-cc-details-tab',
    templateUrl: './src/modules/accounts/templates/contactccdetailstab.html',
    providers: [model]
})
export class ContactCCDetailsTab implements OnChanges, OnInit, AfterViewInit {
    @ViewChild('ccdetailscontainer', {
        read: ViewContainerRef,
        static: true
    }) private ccdetailscontainer: ViewContainerRef;
    @Input() private data: any = undefined;
    @Input('contactid') private contactId: string = undefined;
    @Input('ccid') private ccId: string = undefined;
    @Input('ccname') private ccName: string = undefined;

    constructor(private language: language,
                private metadata: metadata,
                private model: model) {
    }

    public ngOnChanges() {
        this.setModelData();
    }

    public ngOnInit() {
        this.model.module = 'ContactCCDetails';
    }

    public ngAfterViewInit() {
        this.renderView();
    }

    /*
     * Render the configured component set
     * @return void
     * */
    private renderView() {
        let componentconfig = this.metadata.getComponentConfig('ContactCCDetailsTab', 'Accounts');
        let componentSet = componentconfig.componentset;
        if (componentSet) {
            let components = this.metadata.getComponentSetObjects(componentSet);
            for (let component of components) {
                this.metadata.addComponent(component.component, this.ccdetailscontainer).subscribe(componentref => {
                    componentref.instance.componentconfig = component.componentconfig;
                });
            }
        }
    }

    /*
    * Set the model data
    * @return void
    * */
    private setModelData() {
        if (this.data) {
            this.model.id = this.data.id;
            this.model.data = this.data;
        } else {
            this.model.id = this.model.generateGuid();
            this.model.data = {
                id: this.model.id,
                name: this.ccName,
                contact_id: this.contactId,
                companycode_id: this.ccId,
                date_entered: new moment(),
                date_modified: new moment(),
            };
        }
    }
}
