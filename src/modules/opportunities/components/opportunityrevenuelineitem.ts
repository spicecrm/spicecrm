/**
 * @module ModuleOpportunities
 */
import {Component, Input, Output, EventEmitter, OnChanges} from "@angular/core";
import {model} from "../../../services/model.service";
import {metadata} from "../../../services/metadata.service";
import {language} from "../../../services/language.service";
import {view} from "../../../services/view.service";


@Component({
    selector: '[opportunity-revenue-line-item]',
    templateUrl: "./src/modules/opportunities/templates/opportunityrevenuelineitem.html",
    providers: [model]
})
export class OpportunityRevenueLineItem implements OnChanges {

    @Input() private revenueLine: any;
    @Output() private update: EventEmitter<boolean> = new EventEmitter<boolean>()

    constructor(private model: model, private view: view, private language: language) {
        this.model.module = 'OpportunityRevenueLines';
        this.model.data$.subscribe(data => this.update.emit(true));
    }


    public ngOnChanges(): void {
        this.model.id = this.revenueLine.id;
        this.model.data = this.model.utils.backendModel2spice(this.model.module, this.revenueLine);
    }

    get disabled() {
        return !this.view.isEditMode();
    }
}
