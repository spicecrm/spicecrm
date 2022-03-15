/**
 * @module ModuleProducts
 */
import {Component, EventEmitter, Output, ViewChild, ViewContainerRef} from '@angular/core';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {productfinder} from '../services/productfinder.service';


/**
 * @ignore
 */
declare var moment: any;

@Component({
    selector: 'product-browser',
    templateUrl: '../templates/productbrowser.html',
    providers: [productfinder, model]
})
export class ProductBrowser {

    @ViewChild('productbrowsercontent', {read: ViewContainerRef, static: true}) public productbrowsercontent: ViewContainerRef;
    @Output() public selectionchanged: EventEmitter<any> = new EventEmitter<any>();

    constructor(public language: language) {
    }

    public selectionChanged(data) {
        this.selectionchanged.emit(data);
    }
}
