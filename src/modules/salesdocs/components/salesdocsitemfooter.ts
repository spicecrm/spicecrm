/**
 * @module ModuleSalesDocs
 */
import {
    Component, EventEmitter, Input, Output,
} from '@angular/core';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';

@Component({
    selector: '[salesdocs-item-footer]',
    templateUrl: './src/modules/salesdocs/templates/salesdocsitemfooter.html',
    providers: [view]
})
export class SalesDocsItemFooter {

    /**
     * the columns to be displayed
     */
    private fieldsetItems: any[] = [];

    /**
     * if the parent vioew is editing
     */
    @Input() private editing: boolean;

    /**
     * eventemitter when a new item shoudl be added
     */
    @Output() addItem: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor(private metadata: metadata, private model: model, private view: view, private language: language) {
        // hide labels
        this.view.displayLabels = false;

        // determine the list fieldset
        let config = this.metadata.getComponentConfig('SalesDocsItemsContainer', 'SalesDocItems');
        if (config.footerfieldset) {
            this.fieldsetItems = this.metadata.getFieldSetFields(config.footerfieldset);
        }
    }
}
