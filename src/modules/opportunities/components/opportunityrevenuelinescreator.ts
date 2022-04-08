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
    templateUrl: "../templates/opportunityrevenuelinescreator.html"
})
export class OpportunityRevenueLinesCreator {

    /**
     * reference to self
     */
    public self: any;

    /**
     * holds the componentconfig
     */
    public componentconfig: any;

    /**
     * an array with the revenue lines
     */
    public revenueLines: any[] = [];

    /**
     * the type of the split displayed int eh dialog
     */
    public splittype: 'split' | 'rampup' = 'split';

    /**
     * the number of revenue lines to be generated
     */
    public nooflines: number = 1;

    /**
     * the difference in periods between the lines gerenaated
     */
    public periodcount: number = 1;

    /**
     * the type of the period Month or year for the generator
     */
    public periodtype: 'M' | 'y' = 'M';

    /**
     * the event emitter for the reeults
     */
    public generatorResult: EventEmitter<any> = new EventEmitter<any>();

    constructor(public language: language, public metadata: metadata, public model: model) {
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
    public close() {
        this.self.destroy();
    }

    /**
     * generates the revenue lines based on the parameters
     */
    public generate() {
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
    public deleteLine(lineId) {
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
    public save() {
        this.generatorResult.emit({opportunityrevenuesplit: this.splittype, revenueLines: this.revenueLines});
        this.close();
    }
}
