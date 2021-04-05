/*
SpiceUI 2021.01.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

/**
 * @module ModuleOpportunities
 */
import {Component, EventEmitter} from "@angular/core";
import {model} from "../../../services/model.service";
import {metadata} from "../../../services/metadata.service";
import {language} from "../../../services/language.service";

declare var moment: any;

/**
 * renders a modal dialog to create a n initial set of revenue reoognition lines
 */
@Component({
    templateUrl: "./src/modules/opportunities/templates/opportunityrevenuelinescreator.html"
})
export class OpportunityRevenueLinesCreator {

    /**
     * reference to self
     */
    private self: any;

    /**
     * holds the componentconfig
     */
    private componentconfig: any;

    /**
     * an array with the revenue lines
     */
    private revenueLines: any[] = [];

    /**
     * the type of the split displayed int eh dialog
     */
    private splittype: 'split' | 'rampup' = 'split';

    /**
     * the number of revenue lines to be generated
     */
    private nooflines: number = 1;

    /**
     * the difference in periods between the lines gerenaated
     */
    private periodcount: number = 1;

    /**
     * the type of the period Month or year for the generator
     */
    private periodtype: 'M' | 'y' = 'M';

    /**
     * the event emitter for the reeults
     */
    private generatorResult: EventEmitter<any> = new EventEmitter<any>();

    constructor(private language: language, private metadata: metadata, private model: model) {
        this.componentconfig = this.metadata.getComponentConfig('OpportunityRevenueLinesCreator', 'OpportunityRevenueLines');

        // generate a default set
        this.generate();
    }

    get canGenerate(){
        return this.nooflines && this.periodcount;
    }

    /**
     * helper to close the dialog
     */
    private close() {
        this.self.destroy();
    }

    /**
     * generates the revenue lines based on the parameters
     */
    private generate() {
        this.revenueLines = [];
        let closeDate = new moment(this.model.getFieldValue('date_closed'));

        let i = 0;
        while (i < this.nooflines) {

            // calculate the amount dpeneding if it is a split or a rampup
            let amount = this.model.getFieldValue('amount') / this.nooflines;
            if (this.splittype == 'rampup') amount = amount * (i + 1);

            // generate the new record
            let newRecord = {
                id: this.model.utils.generateGuid(),
                amount: amount,
                revenue_date: new moment(closeDate),
                deleted: false
            };
            this.revenueLines.push(newRecord);

            // move the date and the counter
            closeDate.add(this.periodcount, this.periodtype);
            i++;
        }
    }

    /**
     * removes an item
     *
     * @param itemid the guid of the split line
     */
    private deleteLine(lineId) {
        let i = 0;
        this.revenueLines.some(line => {
            if (line.id == lineId) {
                line.deleted = true;
                this.model.setRelatedRecords('opportunityrevenuelines', this.revenueLines);
                return true;
            }
            i++;
        });
    }

    /**
     * save the generated lines emitting them to the parent
     */
    private save() {
        this.generatorResult.emit({opportunityrevenuesplit: this.splittype, revenueLines: this.revenueLines});
        this.close();
    }
}
