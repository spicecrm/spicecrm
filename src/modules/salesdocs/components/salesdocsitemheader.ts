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
    templateUrl: './src/modules/salesdocs/templates/salesdocsitemheader.html',
    providers: [model, view]
})
export class SalesDocsItemHeader {

    /**
     * the columns to be displayed
     */
    private fieldsetItems: any[] = [];

    constructor(private metadata: metadata, private model: model, private view: view) {
        // set the proper model so the fields can be rendered with labels in the header
        this.model.module = 'SalesDocItems';

        // set to short labels
        this.view.labels = "short";

        // determine the list fieldset
        let config = this.metadata.getComponentConfig('SalesDocsItemsContainer', 'SalesDocItems');
        if (config.fieldset) {
            this.fieldsetItems = this.metadata.getFieldSetFields(config.fieldset);
        }
    }
}
