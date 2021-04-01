/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

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
    templateUrl: "./src/modules/potentials/templates/potentialsopportunityallocationlineitem.html",
    providers: [model]
})
export class PotentialsOpportunityAllocationLineItem implements OnChanges {

    /**
     * the potential to be displayed
     */
    @Input() private potential: any;

    /**
     * the opportunity
     */
    @Input() private opportunity: model;

    /**
     * the current allocated amount
     */
    private current_amount: any = 0;

    constructor(private language: language, private model: model, private view: view) {
        this.model.module = 'Potentials';
        this.model.data$.subscribe(data => {
            this.updateOpportunity();
        });
    }

    public ngOnChanges(changes: SimpleChanges): void {
        this.model.id = this.potential.id;
        this.model.data = this.potential;

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
    private updateOpportunity() {
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
