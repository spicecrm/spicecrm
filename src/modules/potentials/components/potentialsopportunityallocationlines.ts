/**
 * @module ModulePotentials
 */
import {Component, Input, OnChanges, SimpleChanges} from "@angular/core";
import {model} from "../../../services/model.service";
import {metadata} from "../../../services/metadata.service";
import {language} from "../../../services/language.service";
import {backend} from "../../../services/backend.service";

/**
 * renders a table with potentials for the account and allows allocation of the opportunity to specific potentials
 */
@Component({
    selector: 'potentials-opportunity-allocation-lines',
    templateUrl: "./src/modules/potentials/templates/potentialsopportunityallocationlines.html"
})
export class PotentialsOpportunityAllocationLines implements OnChanges {

    /**
     * the account id passed in from the opportunity .. so we do not need to subscrbe to the model but react on teh onChanges Event
     */
    @Input() private account_id: string;

    /**
     * the account_id we have loaded the potentials for
     */
    private _account_id: string;

    /**
     * the loaded potentials
     */
    private account_potentials: any[];

    private companyCode: string = '';

    /**
     * indicator if the potentials are loading
     */
    private isLoading: boolean = true;

    constructor(private language: language, private model: model, private backend: backend) {

    }

    /**
     * react to the changes
     *
     * @param changes
     */
    public ngOnChanges(changes: SimpleChanges): void {
        if (this.account_id != this._account_id) {
            this._account_id = this.account_id;
            this.loadPotentials();
        }
    }

    /**
     * returns ture if close date are set and an amount is entered
     */
    get canAllocate() {
        return this.model.getFieldValue('amount') && this.model.getFieldValue('account_id');
    }

    /**
     * loads the potentials for the account assigned to the opportunity
     */
    private loadPotentials() {
        // set to laoding
        this.isLoading = true;

        // reset potentials
        this.account_potentials = [];

        // reset the company code id
        this.companyCode = undefined;

        let params = {
            offset: 0,
            limit: 99
        };

        // load from backend
        this.backend.getRequest('module/Accounts/' + this._account_id + '/related/potentials', params).subscribe(
            accountpotentials => {
                this.account_potentials = [];
                for (let id in accountpotentials) {
                    this.account_potentials.push(this.model.utils.backendModel2spice('Potentials', accountpotentials[id]));

                    if (!this.companyCode) this.companyCode = accountpotentials[id].companycode_id;
                }
                // set to loaded
                this.isLoading = false;
            },
            error => {
                this.isLoading = false;
            });
    }

    /**
     * track function to gain performance
     *
     * @param index
     * @param item
     */
    private trackItemFn(index, item) {
        return item.id;
    }

}
