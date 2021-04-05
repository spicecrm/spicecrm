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
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {model} from '../../../services/model.service';
import {modelutilities} from '../../../services/modelutilities.service';
import {language} from '../../../services/language.service';
import {productfinder} from '../services/productfinder.service';
import {metadata} from "../../../services/metadata.service";


/**
 * @ignore
 */
declare var moment: any;

@Component({
    selector: 'product-brwoser-variant',
    templateUrl: './src/modules/products/templates/productbrowservariant.html',
    providers: [model]
})
export class ProductBrowserVariant implements OnInit {

    @Input() private productvariant: any = {};
    @Output() private selectionchanged: EventEmitter<any> = new EventEmitter<any>();
    private opened: boolean = false;
    private fieldset: string;
    private detailsFieldset: string;

    constructor(private model: model,
                private modelutilities: modelutilities,
                private language: language,
                private metadata: metadata,
                private productfinder: productfinder) {
    }

    get buttonIcon() {
        return this.opened ? 'chevronup' : 'chevrondown';
    }

    get groupAttributes() {
        return this.productfinder.groupAttributes;
    }

    public ngOnInit() {
        this.model.id = this.productvariant.id;
        this.model.module = 'ProductVariants';
        this.model.data = this.modelutilities.backendModel2spice('ProductVariants', this.productvariant);

        const config = this.metadata.getComponentConfig('ProductBrowserVariant', 'ProductVariants');
        this.fieldset = !!config && !!config.fieldset ? config.fieldset : undefined;
        this.detailsFieldset = !!config && !!config.detailsFieldset ? config.detailsFieldset : undefined;

    }

    private toggleOpen() {
        this.opened = !this.opened;
    }

    private godetail() {
        this.selectionchanged.emit({
            type: 'ProductVariant',
            object: this.model
        });
    }

    private edit() {
        this.model.edit(true);
    }
}
