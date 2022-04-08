/**
 * @module ModuleLeads
 */
import {
    Component, Input, Output, EventEmitter, AfterViewInit, ViewChild, ViewContainerRef,
    OnInit, SkipSelf
} from "@angular/core";
import {metadata} from "../../../services/metadata.service";
import {model} from "../../../services/model.service";
import {view} from "../../../services/view.service";

/**
 * shows duplicates model from the model service to allow the user to pick a potential duplicate
 */
@Component({
    selector: "lead-convert-item-duplicate",
    templateUrl: "../templates/leadconvertitemduplicate.html",
    providers: [view]
})
export class LeadConvertItemDuplicate {

    /**
     * the fieldset from the config
     * this is loaded from ObjectRelatedDuplicateTile
     *
     * ToD: Check if we shoudl add a separate configuration for the fieldsets used here
     */
    public fieldset: string;

    /**
     * an eventemitter when an item is selected
     */
    @Output() public itemselected: EventEmitter<any> = new EventEmitter<any>();

    constructor(public view: view, public model: model, public metadata: metadata) {

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
    public getFields() {
        return this.metadata.getFieldSetFields(this.fieldset);
    }

    /**
     * selects the account for usage in the lead
     */
    public useaccount() {
        this.itemselected.emit(this.model.data);
    }
}
