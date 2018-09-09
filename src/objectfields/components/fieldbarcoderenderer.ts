import {Component, Input, OnChanges, AfterViewInit} from '@angular/core';
import {metadata} from "../../services/metadata.service";

declare let JsBarcode: any;

@Component({
    selector: 'field-barcode-renderer',
    templateUrl: './src/objectfields/templates/fieldbarcoderenderer.html'
})
export class fieldBarcodeRenderer implements OnChanges, AfterViewInit {

    @Input() code: any = '';
    @Input() fieldId: any = '';

    constructor(
        private metadata:metadata
    ) {
        this.metadata.loadLibs('js-barcode').subscribe(
            (next) => {
                JsBarcode("#" + this.fieldId, this.code, {
                    width: 1,
                    height: 15,
                    displayValue: false
                });
            }
        );
    }

    ngOnChanges()
    {
        if( !this.metadata.isLibLoaded('js-barcode') )
            return false;

        if (document.getElementById(this.fieldId)) {
            JsBarcode("#" + this.fieldId, this.code, {
                    width: 1,
                    height: 15,
                    displayValue: false
                });
        }
    }

    ngAfterViewInit() {

    }
}