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
                revenue_date: new moment(closeDate)
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
