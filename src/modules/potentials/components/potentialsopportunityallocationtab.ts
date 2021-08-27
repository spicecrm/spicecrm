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
    templateUrl: "./src/modules/potentials/templates/potentialsopportunityallocationtab.html"
})
export class PotentialsOpportunityAllocationTab {

    private account_id: string;
    private account_potentials: any[];

    constructor(private language: language, private metadata: metadata, private model: model, private backend: backend) {
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
    private loadPotentials() {
        this.account_id = this.model.getFieldValue('account_id');
    }

}
