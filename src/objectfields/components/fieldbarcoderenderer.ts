/**
 * @module ObjectFields
 */
import {Component, Input, OnChanges,} from "@angular/core";
import {metadata} from "../../services/metadata.service";
import {libloader} from "../../services/libloader.service";

declare let JsBarcode: any;

@Component({
    selector: "field-barcode-renderer",
    templateUrl: "../templates/fieldbarcoderenderer.html"
})
export class fieldBarcodeRenderer implements OnChanges {

    @Input() public code: any = "";
    @Input() public fieldId: any = "";

    constructor(
        public metadata: metadata,
        public libloader: libloader
    ) {
        this.libloader.loadLib("js-barcode").subscribe(
            (next) => {
                JsBarcode("#" + this.fieldId, this.code, {
                    width: 1,
                    height: 15,
                    displayValue: false
                });
            }
        );
    }

    public ngOnChanges() {
        if( !this.metadata.isLibLoaded("js-barcode") ) {
            return false;
        }

        if (document.getElementById(this.fieldId)) {
            JsBarcode("#" + this.fieldId, this.code, {
                    width: 1,
                    height: 15,
                    displayValue: false
                });
        }
    }
}
