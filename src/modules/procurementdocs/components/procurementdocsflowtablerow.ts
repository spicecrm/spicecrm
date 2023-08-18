/**
 * @module ModuleProcurementDocs
 */
import {Component, Input, OnInit} from "@angular/core";
import {model} from "../../../services/model.service";
import {view} from "../../../services/view.service";

/**
 * one row in the modal table providing a view without labels and a proper model
 */
@Component({
    selector: '[procurement-docs-flow-table-row]',
    templateUrl: "../templates/procurementdocsflowtablerow.html",
    providers: [model, view]
})
export class ProcurementDocsFlowTableRow implements OnInit {
    /**
     * the data for the model
     *
     * @private
     */
    @Input() public data: any;

    /**
     * the fields to be displayed in the table
     * @private
     */
    @Input() public fields: any[] = [];

    constructor(public model: model, public view: view) {
        this.view.displayLabels = false;
    }

    /**
     * initialize and transform the modeldata
     */
    public ngOnInit() {
        this.model.module = 'ProcurementDocs';
        this.model.id = this.data.id;
        this.model.initialize();
        this.model.setData(this.data);
    }


}
