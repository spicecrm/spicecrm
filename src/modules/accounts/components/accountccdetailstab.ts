/**
 * @module ModuleAccounts
 */
import {Component, Input, ViewChild, ViewContainerRef} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';

/**
 * @ignore
 */
declare var moment: any;

@Component({
    selector: 'account-cc-details-tab',
    templateUrl: './src/modules/accounts/templates/accountccdetailstab.html',
    providers: [model]
})

export class AccountCCDetailsTab {
    @ViewChild('ccdetailscontainer', {
        read: ViewContainerRef,
        static: true
    }) private ccdetailscontainer: ViewContainerRef;

    @Input() private data: any = undefined;
    @Input('accountid') private accountid: string = undefined;
    @Input('ccid') private ccId: string = undefined;
    @Input('ccname') private ccName: string = undefined;

    constructor(private language: language,
                private metadata: metadata,
                private model: model) {
    }

    public ngOnInit() {
        this.setModelData();
    }

    public ngAfterViewInit() {
        this.renderView();
    }

    /*
    * Set the model data
    * @return void
    * */
    private setModelData() {
        this.model.module = 'AccountCCDetails';

        if (this.data) {
            this.model.id = this.data.id;
            this.model.data = this.data;
        } else {
            this.model.id = this.model.generateGuid();
            this.model.data = {
                id: this.model.id,
                name: this.ccName,
                account_id: this.accountid,
                companycode_id: this.ccId,
                date_entered: new moment(),
                date_modified: new moment(),
            };
        }
    }

    /*
    * Render the configured component set
    * @return void
    * */
    private renderView() {
        let componentconfig = this.metadata.getComponentConfig('AccountCCDetailsTab', 'Accounts');
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
