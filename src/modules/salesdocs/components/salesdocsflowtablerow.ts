/**
 * @module ModuleSalesDocs
 */
import {Component, Input, OnInit} from "@angular/core";
import {model} from "../../../services/model.service";
import {view} from "../../../services/view.service";

/**
 * one row in the modal table providing a view without labels and a proper model
 */
@Component({
    selector: '[salesdocs-flow-table-row]',
    templateUrl: "./src/modules/salesdocs/templates/salesdocsflowtablerow.html",
    providers: [model, view]
})
export class SalesDocsFlowTableRow implements OnInit {
    /**
     * the data for the model
     *
     * @private
     */
    @Input() private data: any;

    /**
     * the fields to be displayed in the table
     * @private
     */
    @Input() private fields: any[] = [];

    constructor(public model: model, private view: view) {
        this.view.displayLabels = false;
    }

    /**
     * initialize and transform the modeldata
     */
    public ngOnInit() {
        this.model.module = 'SalesDocs';
        this.model.id = this.data.id;
        this.model.initialize();
        this.model.data = this.model.utils.backendModel2spice(this.model.module, this.data);
    }


}
