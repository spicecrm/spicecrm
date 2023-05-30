/**
 * @module ModuleProcurementDocs
 */
import {Component, EventEmitter, Input, Output} from '@angular/core';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';

@Component({
    selector: '[procurement-docs-item-footer]',
    templateUrl: '../templates/procurementdocsitemfooter.html',
    providers: [view]
})
export class ProcurementDocsItemFooter {

    /**
     * the columns to be displayed
     */
    public fieldsetItems: any[] = [];

    /**
     * if the parent vioew is editing
     */
    @Input() public editing: boolean;

    /**
     * eventemitter when a new item shoudl be added
     */
    @Output() public addItem: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor(public metadata: metadata, public model: model, public view: view, public language: language) {
        // hide labels
        this.view.displayLabels = false;

        // determine the list fieldset
        let config = this.metadata.getComponentConfig('ProcurementDocsItemsContainer', 'ProcurementDocItems');
        if (config.footerfieldset) {
            this.fieldsetItems = this.metadata.getFieldSetFields(config.footerfieldset);
        }
    }
}
