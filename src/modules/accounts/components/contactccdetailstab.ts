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
    templateUrl: '../templates/contactccdetailstab.html',
    providers: [model]
})
export class ContactCCDetailsTab implements OnChanges, OnInit, AfterViewInit {
    @ViewChild('ccdetailscontainer', {
        read: ViewContainerRef,
        static: true
    }) public ccdetailscontainer: ViewContainerRef;
    @Input() public data: any = undefined;
    @Input('contactid') public contactId: string = undefined;
    @Input('ccid') public ccId: string = undefined;
    @Input('ccname') public ccName: string = undefined;

    constructor(public language: language,
                public metadata: metadata,
                public model: model) {
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
    public renderView() {
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
    public setModelData() {
        if (this.data) {
            this.model.id = this.data.id;
            this.model.setData(this.data);
        } else {
            this.model.id = this.model.generateGuid();
            this.model.setData({
                id: this.model.id,
                name: this.ccName,
                contact_id: this.contactId,
                companycode_id: this.ccId,
                date_entered: new moment(),
                date_modified: new moment(),
            }, false);
        }
    }
}
