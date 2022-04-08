/**
 * @module ModuleOpportunities
 */
import {Component, Input, Output, EventEmitter, OnChanges} from "@angular/core";
import {model} from "../../../services/model.service";
import {metadata} from "../../../services/metadata.service";
import {language} from "../../../services/language.service";
import {view} from "../../../services/view.service";

/**
 * a table line that representa a revenue share item
 */
@Component({
    selector: '[opportunity-revenue-line-item]',
    templateUrl: "../templates/opportunityrevenuelineitem.html",
    providers: [model]
})
export class OpportunityRevenueLineItem implements OnChanges {

    /**
     * input for the revenue line itself
     */
    @Input() public revenueLine: any;

    /**
     * the close date .. not too nice but needed so it can be passed from the parent in case the date is changed so changed etection is triggered when the dates are recalculated
     */
    @Input() public closeDate: any;

    /**
     * the total amount .. not too nice but needed so it can be passed from the parent in case the amount is changed so changed detection is triggered when the dates are recalculated
     */
    @Input() public totalAmount: any;

    /**
     * an event emitter that fires when the line is updated
     */
    @Output() public update: EventEmitter<boolean> = new EventEmitter<boolean>();

    /**
     * an event emitter that fires when the line is deleted
     */
    @Output() public delete: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor(public model: model, public view: view, public language: language) {
        this.model.module = 'OpportunityRevenueLines';
        this.model.data$.subscribe(data => {
            this.update.emit(true);
        });
    }


    /**
     * @ignore
     */
    public ngOnChanges(): void {
        this.model.id = this.revenueLine.id;
        this.model.setData(this.revenueLine);
    }

    /**
     * simple getter to detect if the buttons etc should be disabled
     */
    get disabled() {
        return !this.view.isEditMode();
    }

    /**
     * action to trigger deete of the line
     */
    public deleteitem() {
        this.delete.emit(true);
    }
}
