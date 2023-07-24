/**
 * @module ModuleProcurementDocs
 */
import {Component, Input, SkipSelf, OnInit} from "@angular/core";
import {model} from "../../../services/model.service";
import {metadata} from "../../../services/metadata.service";
import {view} from "../../../services/view.service";

@Component({
    selector: '[procurement-docs-convert-modal-item]',
    templateUrl: "../templates/procurementdocsconvertmodalitem.html",
    providers: [model, view]
})
export class ProcurementDocsConvertModalItem implements OnInit {

    /**
     * referenec to self added from teh modal service
     * @private
     */
    @Input() public data: any;

    /**
     * the columns to be displayed
     */
    public fieldsetItems: any[] = [];

    constructor(public model: model, public view: view, @SkipSelf() public parent: model, public metadata: metadata) {
        let componentconfig = this.metadata.getComponentConfig('ProcurementDocsConvertModalItem', 'ProcurementDocItems');
        this.fieldsetItems = this.metadata.getFieldSetFields(componentconfig.fieldset);

        this.view.displayLabels = false;
        this.view.isEditable = true;
        this.view.setEditMode();
    }

    /**
     * initialize the model from the data passed in
     */
    public ngOnInit() {
        this.model.module = 'ProcurementDocItems';
        this.model.id = this.data.id;
        this.model.setData(this.data);

        // select by default
        this.data._selected = true;
    }

    get selected() {
        return this.data._selected;
    }

    set selected(value) {
        this.data._selected = value;
    }

}
