/**
 * @module ModuleProducts
 */
import {Component, ElementRef, EventEmitter, Output, ViewChild, ViewContainerRef} from '@angular/core';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';
import {productfinder} from '../services/productfinder.service';
import {metadata} from '../../../services/metadata.service';


/**
 * @ignore
 */
declare var moment: any;

@Component({
    selector: 'product-brwoser-variants',
    templateUrl: '../templates/productbrowservariants.html'
})
export class ProductBrowserVariants {

    public timeout: any;
    public fieldset: string = '';
    @ViewChild('variantscontent', {read: ViewContainerRef, static: true}) public variantsContent: ViewContainerRef;
    @Output() public selectionchanged: EventEmitter<any> = new EventEmitter<any>();

    constructor(public metadata: metadata, public language: language, public backend: backend, public elementRef: ElementRef, public productfinder: productfinder) {
        this.fieldset = this.metadata.getComponentConfig('ProductBrowserVariants').fieldset;
    }

    get productVariants() {
        return this.productfinder.productVariants;
    }

    get loading() {
        return this.productfinder.loading;
    }

    get searchTerm() {
        return this.productfinder.searchterm;
    }

    set searchTerm(value) {
        this.productfinder.searchterm = value;
    }

    public keyUp() {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => this.productfinder.getProductVariants(), 500);
    }

    public onScroll(e) {
        let element = this.variantsContent.element.nativeElement;
        if (element.scrollTop + element.clientHeight + 50 > element.scrollHeight) {
            this.productfinder.getMoreProductVariants();
        }
    }

    public handleSelection(data) {
        this.selectionchanged.emit(data);
    }
}
