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
    templateUrl: './src/modules/products/templates/productbrowservariants.html'
})
export class ProductBrowserVariants {

    private timeout: any;
    private fieldset: string = '';
    @ViewChild('variantscontent', {read: ViewContainerRef, static: false}) private variantsContent: ViewContainerRef;
    @Output() private selectionchanged: EventEmitter<any> = new EventEmitter<any>();

    constructor(private metadata: metadata, private language: language, private backend: backend, private elementRef: ElementRef, private productfinder: productfinder) {
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

    private keyUp() {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => this.productfinder.getProductVariants(), 500);
    }

    private onScroll(e) {
        let element = this.variantsContent.element.nativeElement;
        if (element.scrollTop + element.clientHeight + 50 > element.scrollHeight) {
            this.productfinder.getMoreProductVariants();
        }
    }

    private handleSelection(data) {
        this.selectionchanged.emit(data);
    }
}
