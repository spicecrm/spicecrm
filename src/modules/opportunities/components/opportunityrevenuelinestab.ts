/**
 * @module ModuleOpportunities
 */
import {Component, AfterViewInit, OnInit, OnDestroy, OnChanges, ChangeDetectorRef} from "@angular/core";
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
    templateUrl: "./src/modules/opportunities/templates/opportunityrevenuelinestab.html"
})
export class OpportunityRevenueLinesTab implements OnInit {

    constructor(private language: language, private metadata: metadata, private model: model) {

    }

    public ngOnInit(): void {

    }

    /**
     * returns ture if close date are set and an amount is entered
     */
    get canSplit(){
        return this.model.getFieldValue('amount') && this.model.getFieldValue('date_closed');
    }

}
