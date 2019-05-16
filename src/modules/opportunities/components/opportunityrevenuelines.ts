/**
 * @module ModuleOpportunities
 */
import {Component, AfterViewInit, OnInit, OnDestroy, OnChanges} from "@angular/core";
import {model} from "../../../services/model.service";
import {modal} from "../../../services/modal.service";
import {metadata} from "../../../services/metadata.service";
import {language} from "../../../services/language.service";
import {view} from "../../../services/view.service";

declare var moment: any;

/**
 * renders a table with lines for the revenue recognition at different times
 */
@Component({
    templateUrl: "./src/modules/opportunities/templates/opportunityrevenuelines.html"
})
export class OpportunityRevenueLines implements OnInit {

    /**
     * an array with the revenue lines
     */
    private revenueLines: any[] = [];

    /**
     * keep the opportunity close date so we can track changes and f the date changes update the rampup or recognition plan
     */
    private closeDate: any;

    constructor(private language: language, private metadata: metadata, private model: model, private view: view, private modal: modal) {
        this.model.data$.subscribe(data => {
            // reload the revenue lines
            this.loadRevenueLines();

            // check if the close dae has changed
            this.checkCloseDate();
        });

        this.view.mode$.subscribe(changemode => {
            this.loadRevenueLines();
        });
    }

    public ngOnInit(): void {
        this.loadRevenueLines();
        this.checkCloseDate();
    }

    /**
     * load the revenue line items from the model and validates teh model setting the message on the field
     */
    private loadRevenueLines() {
        this.revenueLines = this.model.getRelatedRecords('opportunityrevenuelines');
        this.sortRevenueLines();

        if (this.view.isEditMode()) {
            let oppamount = this.model.getField('amount');
            let summedamount = 0;

            for (let revenuteLine of this.revenueLines) {
                summedamount += revenuteLine.amount;
            }

            if (oppamount != summedamount) {
                this.model.setFieldMessage('error', 'suem does not match', 'opportunityrevenuelines', 'opportunityrevenuelines');
            } else {
                this.model.resetFieldMessages('opportunityrevenuelines');
            }
        }
    }

    private checkCloseDate() {
        if (this.closeDate) {
            if (!this.model.getFieldValue('date_closed').isSame(this.closeDate, 'day')) {
                this.modal.confirm('do you want ot update the revenue lines with the new closed date', 'closed date changed', 'shade').subscribe(response => {
                    if (response) {
                        let duration = moment.duration(this.model.getFieldValue('date_closed').diff(this.closeDate));
                        for (let revenueLine of this.revenueLines) {
                            revenueLine.revenue_date.add(duration);
                        }
                    }
                    this.closeDate = this.model.getFieldValue('date_closed');
                });
            }
        } else {
            this.closeDate = this.model.getFieldValue('date_closed');
        }
    }

    /**
     * sorts the lines by date
     */
    private sortRevenueLines() {
        this.revenueLines.sort((a, b) => {
            return new moment(a.revenue_date).isBefore(new moment(b.revenue_date)) ? -1 : 1;
        });
    }

    /**
     * collects the field messages
     */
    get fieldMessages() {
        if (this.view.isEditMode()) {
            let fieldMessages = this.model.getFieldMessages('opportunityrevenuelines');
            return fieldMessages ? fieldMessages : [];
        } else {
            return [];
        }
    }

    /**
     * triggered when the line item updates to reload and revalidate
     */
    private revalidate() {
        this.loadRevenueLines();
    }

    /**
     * simple getter to return if the view is in editmode
     */
    get isEditing() {
        return this.view.isEditMode();
    }

    /**
     * adds a revenue line
     */
    private addLine() {

        let newRecord = {
            id: this.model.utils.generateGuid(),
            amount: 0,
            amount_usdollar: 0,
            revenue_date: new moment()
        };
        this.revenueLines.push(newRecord);
        this.sortRevenueLines();
        this.model.setRelatedRecords('opportunityrevenuelines', this.revenueLines);
    }
}
