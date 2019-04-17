/**
 * @module ObjectFields
 */
import {Component, Input, OnChanges,} from "@angular/core";
import {metadata} from "../../services/metadata.service";

declare let JsBarcode: any;

@Component({
    selector: "field-barcode-renderer",
    templateUrl: "./src/objectfields/templates/fieldbarcoderenderer.html"
})
export class fieldBarcodeRenderer implements OnChanges {

    @Input() private code: any = "";
    @Input() private fieldId: any = "";

    constructor(
        private metadata: metadata
    ) {
        this.metadata.loadLibs("js-barcode").subscribe(
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
