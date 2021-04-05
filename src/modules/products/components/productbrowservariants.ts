/*
SpiceUI 2021.01.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

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
    @ViewChild('variantscontent', {read: ViewContainerRef, static: true}) private variantsContent: ViewContainerRef;
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
