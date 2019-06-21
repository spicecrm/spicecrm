/**
 * @module ModuleAccounts
 */
import {Component, Input, ViewChild, ViewContainerRef} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {language} from '../../../services/language.service';
import {toast} from '../../../services/toast.service';
import {backend} from '../../../services/backend.service';

/**
* @ignore
*/
declare var moment: any;

@Component({
    selector: 'contact-cc-details-tab',
    templateUrl: './src/modules/accounts/templates/contactccdetailstab.html',
    providers: [model]
})
export class ContactCCDetailsTab {
    @ViewChild('ccdetailscontainer', {read: ViewContainerRef, static: false}) ccdetailscontainer: ViewContainerRef;
    @Input() data: any = undefined;
    @Input('contactid') contactId: string = undefined;
    @Input('ccid') ccId: string = undefined;
    @Input('ccname') ccName: string = undefined;

    constructor(private language: language,
                private metadata: metadata,
                private view: view,
                private toast: toast,
                private backend: backend,
                private model: model) {
    }

    ngOnInit() {
        this.model.module = 'ContactCCDetails';
    }

    ngAfterViewInit() {
        this.buildContainer();
    }

    ngOnChanges() {
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
            }
        }
    }

    buildContainer() {
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
}
