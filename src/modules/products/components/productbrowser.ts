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
    templateUrl: './src/modules/products/templates/productbrowser.html',
    providers: [productfinder, model]
})
export class ProductBrowser {

    @ViewChild('productbrowsercontent', {read: ViewContainerRef}) private productbrowsercontent: ViewContainerRef;
    @Output() private selectionchanged: EventEmitter<any> = new EventEmitter<any>();

    constructor(private language: language) {
    }

    private selectionChanged(data) {
        this.selectionchanged.emit(data);
    }
}
