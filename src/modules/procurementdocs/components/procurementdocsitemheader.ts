/**
 * @module ModuleProcurementDocs
 */
import {Component} from '@angular/core';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {metadata} from '../../../services/metadata.service';

@Component({
    selector: '[procurement-docs-item-header]',
    templateUrl: '../templates/procurementdocsitemheader.html',
    providers: [model, view]
})
export class ProcurementDocsItemHeader {

    /**
     * the columns to be displayed
     */
    public fieldsetItems: any[] = [];

    constructor(public metadata: metadata, public model: model, public view: view) {
        // set the proper model so the fields can be rendered with labels in the header
        this.model.module = 'ProcurementDocItems';

        // set to short labels
        this.view.labels = "short";

        // determine the list fieldset
        let config = this.metadata.getComponentConfig('ProcurementDocsItemsContainer', 'ProcurementDocItems');
        if (config.fieldset) {
            this.fieldsetItems = this.metadata.getFieldSetFields(config.fieldset);
        }
    }
}
