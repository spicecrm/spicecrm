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
declare var _: any;

@Component({
    selector: 'account-cc-details-tab',
    templateUrl: '../templates/accountccdetailstab.html',
    providers: [model]
})

export class AccountCCDetailsTab {
    @ViewChild('ccdetailscontainer', {
        read: ViewContainerRef,
        static: true
    }) public ccdetailscontainer: ViewContainerRef;

    @Input() public data: any = undefined;
    @Input() public componentconfig: any = {};

    @Input() public parent: model;

    @Input() public ccode: any = {};

    constructor(public language: language,
                public metadata: metadata,
                public model: model) {

        // set the model
        this.model.module = 'AccountCCDetails';
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
    public setModelData() {
        if (this.data) {
            this.model.id = this.data.id;
            this.model.setFields(this.model.utils.backendModel2spice(this.model.module, this.data));
        } else {
            this.model.initialize(this.parent);
            this.model.setFields({
                name: this.ccode.name,
                companycode_id: this.ccode.id
            });

            // if not set by copy rules .. just to ensure we do not get zombie entries
            if (!this.model.getField('account_id')) {
                this.model.setFields({
                    account_id: this.parent.id,
                    account_name: this.parent.getField('name')
                });
            }
        }
    }

    /*
    * Render the configured component set
    * @return void
    * */
    public renderView() {

        if (_.isEmpty(this.componentconfig)) {
            // check to get the config
            this.componentconfig = this.metadata.getComponentConfig('AccountCCDetails', 'AccountCCDetails');

            // fallback to check with Accounts
            if (_.isEmpty(this.componentconfig)) {
                this.componentconfig = this.metadata.getComponentConfig('AccountCCDetailsTab', 'Accounts');
            }
        }

        // get the componentset
        let componentSet = this.componentconfig.componentset;
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
