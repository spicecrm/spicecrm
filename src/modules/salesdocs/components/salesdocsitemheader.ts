/**
 * @module ModuleSalesDocs
 */
import {
    Component,
} from '@angular/core';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {metadata} from '../../../services/metadata.service';

@Component({
    selector: '[salesdocs-item-header]',
    templateUrl: '../templates/salesdocsitemheader.html',
    providers: [model, view]
})
export class SalesDocsItemHeader {

    /**
     * the columns to be displayed
     */
    public fieldsetItems: any[] = [];

    constructor(public metadata: metadata, public model: model, public view: view) {
        // set the proper model so the fields can be rendered with labels in the header
        this.model.module = 'SalesDocItems';

        // set to short labels
        this.view.labels = "short";

        // align the labels according to the type
        this.view.alignLabels = true;

        // determine the list fieldset
        let config = this.metadata.getComponentConfig('SalesDocsItemsContainer', 'SalesDocItems');
        if (config.fieldset) {
            this.fieldsetItems = this.metadata.getFieldSetFields(config.fieldset);
        }
    }
}
