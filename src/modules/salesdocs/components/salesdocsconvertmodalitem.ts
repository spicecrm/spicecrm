/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

/**
 * @module ModuleSalesDocs
 */
import {Component, Input, SkipSelf, OnInit} from "@angular/core";
import {model} from "../../../services/model.service";
import {metadata} from "../../../services/metadata.service";
import {view} from "../../../services/view.service";

@Component({
    selector: '[salesdocs-convert-modal-item]',
    templateUrl: "./src/modules/salesdocs/templates/salesdocsconvertmodalitem.html",
    providers: [model, view]
})
export class SalesDocsConvertModalItem implements OnInit {

    /**
     * referenec to self added from teh modal service
     * @private
     */
    @Input() private data: any;

    /**
     * the columns to be displayed
     */
    private fieldsetItems: any[] = [];

    constructor(public model: model, private view: view, @SkipSelf() private parent: model, private metadata: metadata) {
        let componentconfig = this.metadata.getComponentConfig('SalesDocsConvertModalItem', 'SalesDocItems');
        this.fieldsetItems = this.metadata.getFieldSetFields(componentconfig.fieldset);

        this.view.displayLabels = false;
        this.view.isEditable = true;
        this.view.setEditMode();
    }

    /**
     * initialize the model from the data passed in
     */
    public ngOnInit() {
        this.model.module = 'SalesDocItems';
        this.model.id = this.data.id;
        this.model.data = this.model.utils.backendModel2spice(this.model.module, this.data);

        // select by default
        this.data._selected = true;
    }

    get selected() {
        return this.data._selected;
    }

    set selected(value) {
        this.data._selected = value;
    }

}
