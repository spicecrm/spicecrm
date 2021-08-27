/**
 * @module ModuleSalesDocs
 */
import {Component, Input, SkipSelf, OnInit} from "@angular/core";
import {model} from "../../../services/model.service";
import {metadata} from "../../../services/metadata.service";
import {view} from "../../../services/view.service";

@Component({
    selector: '[salesdocs-convert-modal-item]',
    templateUrl: "./src/modules/salesdocs/templates/salesdocsconvertmodalitem.html",
    providers: [model, view]
})
export class SalesDocsConvertModalItem implements OnInit {

    /**
     * referenec to self added from teh modal service
     * @private
     */
    @Input() private data: any;

    /**
     * the columns to be displayed
     */
    private fieldsetItems: any[] = [];

    constructor(public model: model, private view: view, @SkipSelf() private parent: model, private metadata: metadata) {
        let componentconfig = this.metadata.getComponentConfig('SalesDocsConvertModalItem', 'SalesDocItems');
        this.fieldsetItems = this.metadata.getFieldSetFields(componentconfig.fieldset);

        this.view.displayLabels = false;
        this.view.isEditable = true;
        this.view.setEditMode();
    }

    /**
     * initialize the model from the data passed in
     */
    public ngOnInit() {
        this.model.module = 'SalesDocItems';
        this.model.id = this.data.id;
        this.model.data = this.model.utils.backendModel2spice(this.model.module, this.data);

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
