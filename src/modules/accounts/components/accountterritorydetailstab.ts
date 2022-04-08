/**
 * @module ModuleAccounts
 */
import {Component, Input, SkipSelf, ViewChild, ViewContainerRef} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';

/**
 * @ignore
 */
declare var moment: any;
declare var _: any;

@Component({
    selector: 'account-territory-details-tab',
    templateUrl: '../templates/accountterritorydetailstab.html',
    providers: [model]
})

export class AccountTerritoryDetailsTab {

    @Input() public data: any = undefined;

    @Input() public componentconfig: any = {};

    public componentset: string;

    constructor(public language: language,
                public metadata: metadata,
                @SkipSelf() public parent: model,
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
            this.componentconfig = this.metadata.getComponentConfig('AccountTerritoryDetails', 'AccountCCDetails');
        }

        // get the componentset
        this.componentset = this.componentconfig.componentset;
    }
}
