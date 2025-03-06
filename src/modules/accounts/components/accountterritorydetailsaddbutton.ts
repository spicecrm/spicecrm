import {Component, ComponentRef, OnInit, SkipSelf} from '@angular/core';
import {ActionSetItemI} from "../../../objectcomponents/interfaces/objectcomponents.interfaces";
import {modal} from "../../../services/modal.service";
import {model} from "../../../services/model.service";
import {configurationService} from "../../../services/configuration.service";
import {metadata} from "../../../services/metadata.service";

@Component({
    selector: 'account-territory-details-add-button',
    templateUrl: '../templates/accountterritorydetailsaddbutton.html',
    providers: [model]
})

export class AccountTerritoryDetailsAddButton implements ActionSetItemI, OnInit {
    /**
     * holds the action item config
     */
    public actionconfig: any;
    /**
     * instance reference of this component
     */
    public self: ComponentRef<AccountTerritoryDetailsAddButton>;
    /**
     * available cc details excluding the cc details already linked to the account
     * @private
     */
    private availableCCodes: { id: string; name: string; companycode: string }[] = [];

    constructor(private modal: modal,
                private model: model,
                @SkipSelf() private parentModel: model,
                private configuration: configurationService,
                private metadata: metadata) {
    }

    /**
     * disabled flag
     */
    get disabled(): boolean {
        return this.availableCCodes.length == 0;
    }

    /**
     * hidden flag
     */
    get hidden(): boolean {
        return !this.metadata.checkModuleAcl('AccountCCDetails', 'create');
    }

    /**
     * set available cc details
     */
    public ngOnInit() {
        const relatedCCDetails = window._.toArray(this.parentModel.data.accountccdetails?.beans);
        this.availableCCodes = this.configuration.getData('companycodes')?.filter(
            cc => !relatedCCDetails.some(d => cc.id == d.companycode_id)
        );

        if (!this.actionconfig?.componentset) {
            this.actionconfig = this.metadata.getComponentConfig('AccountTerritoryDetailsAddButton', 'AccountCCDetails');
        }
    }

    /**
     * check and open select prompt for the Company Codes
     */
    public execute(): void {

        const options = this.availableCCodes.map(c => ({display: c.name, value: c.id, disabled: this.availableCCodes.length == 1}));
        const defaultValue = options.length == 1 ? options[0].value : undefined;

        this.modal.prompt('input', 'LBL_MAKE_SELECTION', 'LBL_COMPANYCODE', 'shade', defaultValue, options, 'radio').subscribe(answer => {
            if (!answer) return;

            const presets = {
                companycode_id: answer,
                name: this.availableCCodes.find(c => c.id == answer).companycode,
                account_id: this.parentModel.id
            };

            if (!!this.actionconfig?.componentset) {

                const config = {componentset: this.actionconfig.componentset};

                this.model.addModel(null, this.parentModel, presets, false, config).subscribe({
                    next: () => {
                        this.afterSave(answer);
                    }
                });
            } else {
                this.model.reset();
                this.model.module = 'AccountCCDetails';
                this.model.initialize(this.parentModel);
                this.model.setFields(presets);

                const loadingModal = this.modal.await('LBL_LOADING');

                this.model.save(true).subscribe({
                    next: () => {
                        this.afterSave(answer);
                        loadingModal.next(true);
                        loadingModal.complete();
                    },
                    error: () => {
                        loadingModal.next(true);
                        loadingModal.complete();
                    }
                });
            }
        });
    }

    /**
     * filter the available list
     * @param id
     * @private
     */
    private afterSave(id: string) {
        this.availableCCodes = this.availableCCodes.filter(c => c.id != id);
        this.parentModel.addRelatedRecords('accountccdetails', [this.model.data]);
    }
}