/**
 * @module ModulePotentials
 */
import {Component, Input, OnChanges, SimpleChanges} from "@angular/core";
import {model} from "../../../services/model.service";
import {metadata} from "../../../services/metadata.service";
import {language} from "../../../services/language.service";
import {view} from "../../../services/view.service";

/**
 * the individual table line in the allocation table
 */
@Component({
    selector: '[potentials-opportunity-allocation-line-item]',
    templateUrl: "../templates/potentialsopportunityallocationlineitem.html",
    providers: [model]
})
export class PotentialsOpportunityAllocationLineItem implements OnChanges {

    /**
     * the potential to be displayed
     */
    @Input() public potential: any;

    /**
     * the opportunity
     */
    @Input() public opportunity: model;

    /**
     * the current allocated amount
     */
    public current_amount: any = 0;

    constructor(public language: language, public model: model, public view: view) {
        this.model.module = 'Potentials';
        this.model.data$.subscribe(data => {
            this.updateOpportunity();
        });
    }

    public ngOnChanges(changes: SimpleChanges): void {
        this.model.id = this.potential.id;
        this.model.setData(this.potential);

        // check if we have a potentiual maintianed on the opportunity
        let activepotentials = this.opportunity.getFieldValue('opportunitypotentials');
        if (activepotentials) {
            let thispotential = activepotentials.find(potential => potential.id == this.model.id);
            if (thispotential) {
                this.current_amount = thispotential.opportunity_amount;
            }
        }
        this.model.setField('opportunity_amount', this.current_amount);
    }

    /**
     * simple getter to detect if the buttons etc should be disabled
     */
    get disabled() {
        return !this.view.isEditMode();
    }

    /**
     * update the opportunity
     */
    public updateOpportunity() {
        // opportunity might not be set yet
        if (!this.opportunity) return;

        let modelAmount = this.model.getFieldValue('opportunity_amount');
        if (modelAmount != this.current_amount) {

            // update the proper potential
            let activepotentials = this.opportunity.getFieldValue('opportunitypotentials');

            // if none are maintained create an empty array
            if (!activepotentials) activepotentials = [];

            // try to find the current one
            let thispotentialIndex = activepotentials.findIndex(potential => potential.id == this.model.id);
            if (thispotentialIndex >= 0) {
                if (modelAmount > 0) {
                    activepotentials[thispotentialIndex].opportunity_amount = modelAmount;
                } else {
                    activepotentials.splice(thispotentialIndex, 1);
                }
                this.current_amount = modelAmount;

            } else {
                activepotentials.push({id: this.model.id, opportunity_amount: modelAmount});
            }
            this.opportunity.setField('opportunitypotentials', activepotentials);

            // set the total Amount of the Opportunity
            let totalAmount = 0;
            for (let activepotential of activepotentials) {
                totalAmount += parseFloat(activepotential.opportunity_amount);
            }
            this.opportunity.setField('amount', totalAmount);
        }
    }
}
