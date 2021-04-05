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
import {Component, ElementRef, Input, OnChanges} from '@angular/core';
import {view} from '../../../services/view.service';
import {language} from '../../../services/language.service';

@Component({
    selector: 'product-variants-attributes-table',
    templateUrl: './src/modules/products/templates/productvariantsattributestable.html'
})
export class ProductVariantsAttributesTable implements OnChanges {

    @Input() public attributes: any[] = [];
    private displaygroups: any[] = [];
    private displaygroup: string = 'all';
    private showrequired: boolean = true;
    private showoptional: boolean = true;
    private showreadonly: boolean = true;

    constructor(private language: language, private elementRef: ElementRef, private view: view) {
    }

    get displayAttributes() {
        return this.attributes
            .filter(attr => this.displayAttribute(attr) && (this.displaygroup == 'all' || (this.displaygroup != 'all' && attr.attr_usagegrp == this.displaygroup)))
            .sort((a, b) => {
                return +a.sort_sequence > +b.sort_sequence ? 1 : -1;
            });
    }

    public ngOnChanges() {
        this.setDisplayGroups();
    }

    private setDisplayGroups() {
        this.displaygroups = [];
        if (!this.attributes) return;
        this.attributes.forEach(attr => {
            if (attr.attr_usagegrp && attr.attr_usagegrp != '' && this.displaygroups.indexOf(attr.attr_usagegrp) == -1) {
                this.displaygroups.push(attr.attr_usagegrp);
            }
        });
    }

    private required(attribute) {
        return this.view.isEditMode() && attribute.attr_usage == 'required';
    }

    private displayAttribute(attribute) {

        switch (attribute.attr_usage) {
            case 'none':
                return this.showreadonly;
            case 'required':
                return this.showrequired;
            default:
                return this.showoptional;
        }
    }
}
