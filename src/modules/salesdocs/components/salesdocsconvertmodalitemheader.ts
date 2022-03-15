/**
 * @module ModuleSalesDocs
 */
import {Component, Input, SkipSelf, OnInit} from "@angular/core";
import {model} from "../../../services/model.service";
import {metadata} from "../../../services/metadata.service";

@Component({
    selector: '[salesdocs-convert-modal-item-header]',
    templateUrl: "../templates/salesdocsconvertmodalitemheader.html"
})
export class SalesDocsConvertModalItemHeader {

    /**
     * referenec to self added from teh modal service
     * @private
     */
    @Input() public data: any;

    /**
     * the columns to be displayed
     */
    public fieldsetItems: any[] = [];

    constructor(public model: model, @SkipSelf() public parent: model, public metadata: metadata) {
        let componentconfig = this.metadata.getComponentConfig('SalesDocsConvertModalItem', 'SalesDocItems');
        this.fieldsetItems = this.metadata.getFieldSetFields(componentconfig.fieldset);
    }
}
