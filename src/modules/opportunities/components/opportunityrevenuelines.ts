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
 * @module ModuleOpportunities
 */
import {
    Component,
    AfterViewInit,
    OnInit,
    OnDestroy,
    OnChanges,
    ChangeDetectorRef,
    ViewContainerRef
} from "@angular/core";
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
    selector: 'opportunity-revenue-lines',
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

    /**
     * the total amount of the opportunity
     */
    private totalAmount: any;

    constructor(private language: language, private metadata: metadata, private model: model, private view: view, private modal: modal, private changeDetectorRef: ChangeDetectorRef, private viewContainerRef: ViewContainerRef) {
        this.model.data$.subscribe(data => {
            // reload the revenue lines
            this.loadRevenueLines();

            // check if the close dae has changed
            this.checkCloseDate();

            // check if the amount has changed
            this.checkAmount();

            this.checkConsistency();
        });

        this.view.mode$.subscribe(changemode => {
            this.loadRevenueLines();
            this.checkConsistency();
        });
    }

    public ngOnInit(): void {
        this.loadRevenueLines();
        this.checkCloseDate();
        this.checkAmount();
        this.checkConsistency();
    }

    /**
     * returns ture if close date are set and an amount is entered
     */
    get canSplit() {
        return this.closeDate && this.totalAmount;
    }

    get hasActiveLines() {
        return this.revenueLines.filter(record => record.deleted != true).length > 0;
    }

    /**
     * load the revenue line items from the model and validates teh model setting the message on the field
     */
    private loadRevenueLines() {
        this.revenueLines = [];
        let lines = this.model.getRelatedRecords('opportunityrevenuelines');
        for (let line of lines) {
            this.revenueLines.push(line);
        }

        this.sortRevenueLines();
    }

    private checkConsistency() {
        if (this.view.isEditMode()) {
            let oppamount = this.model.getField('amount');
            switch (this.model.getFieldValue('opportunityrevenuesplit')) {
                case 'split':
                    let summedamount = 0;

                    for (let revenuteLine of this.revenueLines) {
                        if (revenuteLine.deleted != true) {
                            summedamount += revenuteLine.amount;
                        }
                    }

                    if (oppamount != summedamount) {
                        this.model.setFieldMessage('error', 'total amount does not match', 'opportunityrevenuelines', 'opportunityrevenuelines');
                    } else {
                        this.model.resetFieldMessages('opportunityrevenuelines');
                    }
                    break;
                case 'rampup':
                    let lastRow = this.revenueLines.filter(line => line.delete != true).slice(-1).pop();

                    if (!lastRow || lastRow.amount != oppamount) {
                        this.model.setFieldMessage('error', 'rampup amount does not match', 'opportunityrevenuelines', 'opportunityrevenuelines');
                    } else {
                        this.model.resetFieldMessages('opportunityrevenuelines');
                    }
                    break;
                default:
                    this.model.resetFieldMessages('opportunityrevenuelines');
                    break;
            }

        }
    }

    /**
     * handles the date changed on the model and prompts the user if the dates shopudlbe updated if the close date of the opp changes
     *
     * if confirmed by the user moves the dates bby the same diff as the opp date has been moved
     */
    private checkCloseDate() {
        if (this.closeDate) {
            if (this.model.getFieldValue('opportunityrevenuesplit') != 'none' && !this.model.getFieldValue('date_closed').isSame(this.closeDate, 'day')) {
                this.modal.confirm(this.language.getLabel('MSG_UPDATE_CHANGED_DATE', null, "long"), this.language.getLabel('MSG_UPDATE_CHANGED_DATE'), 'shade').subscribe(response => {
                    if (response) {
                        let duration = moment.duration(this.model.getFieldValue('date_closed').diff(this.closeDate));
                        for (let revenueLine of this.revenueLines) {
                            if (revenueLine.deleted != true) {
                                revenueLine.revenue_date.add(duration);
                            }
                        }
                        this.changeDetectorRef.detectChanges();
                    }
                    this.closeDate = this.model.getFieldValue('date_closed');
                });
            }
        } else {
            this.closeDate = this.model.getFieldValue('date_closed');
        }
    }

    /**
     * handles the change of amount on the opportunity and if the amount changes prompts the user to also change the revenue lines.
     *
     * If confirmed by the user updates the amounts equally
     */
    private checkAmount() {
        if (this.totalAmount) {
            if (this.model.getFieldValue('opportunityrevenuesplit') != 'none' && this.model.getFieldValue('amount') != this.totalAmount) {
                this.modal.confirm(this.language.getLabel('MSG_UPDATE_CHANGED_AMOUNT', null, "long"), this.language.getLabel('MSG_UPDATE_CHANGED_AMOUNT'), 'shade').subscribe(response => {
                    if (response) {
                        let factor = this.model.getFieldValue('amount') / this.totalAmount;
                        for (let revenueLine of this.revenueLines) {
                            if (revenueLine.deleted != true) {
                                revenueLine.amount = Math.round(revenueLine.amount * factor * 100) / 100;
                            }
                        }
                        this.changeDetectorRef.detectChanges();
                    }

                    // set the toal amount in the component
                    this.totalAmount = this.model.getFieldValue('amount');

                    // check that the values match
                    this.checkConsistency();
                });
            }
        } else {
            this.totalAmount = this.model.getFieldValue('amount');
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
        this.checkConsistency();
    }

    /**
     * simple getter to return if the view is in editmode
     */
    get isEditing() {
        return this.view.isEditMode();
    }

    /**
     * renders a modal to initalize the revenue lines
     */
    private initalizeLines() {
        this.modal.openModal('OpportunityRevenueLinesCreator', true, this.viewContainerRef.injector).subscribe(componenref => {
            componenref.instance.generatorResult.subscribe(result => {
                this.model.setField('opportunityrevenuesplit', result.opportunityrevenuesplit);
                this.model.setRelatedRecords('opportunityrevenuelines', result.revenueLines);
                this.loadRevenueLines();
                this.checkConsistency();
            });
        });
    }

    /**
     * adds a revenue line
     */
    private addLine() {

        let newRecord = {
            id: this.model.utils.generateGuid(),
            amount: 0,
            amount_usdollar: 0,
            revenue_date: this.closeDate,
            deleted: false
        };
        this.revenueLines.push(newRecord);
        this.sortRevenueLines();
        this.model.setRelatedRecords('opportunityrevenuelines', this.revenueLines);
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

        // if we removed the last one set to none
        if (this.hasActiveLines) {
            this.loadRevenueLines();
            this.checkConsistency();
        } else {
            this.model.setField('opportunityrevenuesplit', 'none');
            this.checkConsistency();
        }
    }
}
