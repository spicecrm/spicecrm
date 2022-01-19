/**
 * @module ModulePotentials
 */
import {Component} from "@angular/core";
import {model} from "../../../services/model.service";
import {metadata} from "../../../services/metadata.service";
import {language} from "../../../services/language.service";
import {backend} from "../../../services/backend.service";

/**
 * renders a table with potentials for the account and allows allocation of the opportunity to specific potentials
 */
@Component({
    templateUrl: "../templates/potentialsopportunityallocationtab.html"
})
export class PotentialsOpportunityAllocationTab {

    public account_id: string;
    public account_potentials: any[];

    constructor(public language: language, public metadata: metadata, public model: model, public backend: backend) {
        this.model.data$.subscribe(data => {
            this.loadPotentials();
        });
    }

    /**
     * returns ture if close date are set and an amount is entered
     */
    get canAllocate() {
        return this.model.getFieldValue('account_id');
    }


    /**
     * loads the potentials for the account assigned to the opportunity
     */
    public loadPotentials() {
        this.account_id = this.model.getFieldValue('account_id');
    }

}
