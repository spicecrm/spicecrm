/**
 * @module ModuleLeads
 */
import {
    Component, Input, Output, EventEmitter, AfterViewInit, ViewChild, ViewContainerRef,
    OnInit, SkipSelf
} from "@angular/core";
import {metadata} from "../../../services/metadata.service";
import {model} from "../../../services/model.service";
import {modelutilities} from "../../../services/modelutilities.service";
import {fts} from "../../../services/fts.service";
import {view} from "../../../services/view.service";
import {language} from '../../../services/language.service';

@Component({
    selector: "lead-convert-item-duplicate",
    templateUrl: "./src/modules/leads/templates/leadconvertitemduplicate.html",
    providers: [view]
})
export class LeadConvertItemDuplicate {

    private fieldset: string;

    @Output() private accountselected: EventEmitter<any> = new EventEmitter<any>();

    constructor(private view: view, private model: model, private metadata: metadata) {

        // initialize the view
        this.view.isEditable = false;
        this.view.displayLabels = false;

    }

    /**
     * loads the config and the fieldset
     */
    public ngOnInit() {

        let componentconfig = this.metadata.getComponentConfig('ObjectRelatedDuplicateTile', this.model.module);
        this.fieldset = componentconfig.fieldset;

    }

    /**
     * returns the fields
     */
    private getFields() {
        return this.metadata.getFieldSetFields(this.fieldset);
    }

    /**
     * selects the account for usage in the lead
     */
    private useaccount() {
        this.accountselected.emit(this.model.data);
    }
}
