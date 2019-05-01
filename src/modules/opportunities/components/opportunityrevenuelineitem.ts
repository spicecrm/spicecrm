/**
 * @module ModuleOpportunities
 */
import {Component, AfterViewInit, OnInit, OnDestroy, OnChanges} from "@angular/core";
import {model} from "../../../services/model.service";
import {metadata} from "../../../services/metadata.service";
import {language} from "../../../services/language.service";
import {view} from "../../../services/view.service";


@Component({
    templateUrl: "./src/modules/opportunities/templates/opportunityrevenuelineitem.html"
})
export class OpportunityRevenueLineItem implements OnInit {

    private revenueLines: any[] = [];

    constructor(private language: language, private metadata: metadata, private model: model, private view: view) {
        this.model.data$.subscribe(data => {
            this.loadRevenueLines();
        });

        this.view.mode$.subscribe(changemode => {
            this.loadRevenueLines();
        });
    }

    public ngOnInit(): void {
        this.loadRevenueLines();
    }

    private loadRevenueLines() {
        this.revenueLines = this.model.getRelatedRecords('opportunityrevenuelines');

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

    get fieldMessages() {
        if(this.view.isEditMode()){
            let fieldMessages = this.model.getFieldMessages('opportunityrevenuelines');
            return fieldMessages ? fieldMessages : [];
        } else {
            return [];
        }
    }
}
