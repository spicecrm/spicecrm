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
 * @module ObjectComponents
 */

import {Component, OnInit, Input} from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {modal} from "../../services/modal.service";

/**
 * represents an object in the duplicates search
 */
@Component({
    selector: 'object-related-duplicate-tile',
    templateUrl: './src/objectcomponents/templates/objectrelatedduplicatetile.html',
    providers: [view]
})
export class ObjectRelatedDuplicateTile implements OnInit {

    /**
     * to enable the link on the tile
     */
    @Input() private enableLink: boolean = true;

    /**
     * show a button .. used in the edit modal since the link would lead to leavin gthe modal and navigate in teh back behind the modal
     */
    @Input() private enableButtonLink: boolean = false;

    /**
     * the fieldset from the config
     */
    private fieldset: string = '';

    constructor(private model: model, private modal: modal, private view: view, private language: language, private metadata: metadata) {
        this.view.displayLabels = false;
    }

    /**
     * loads the config and the fieldset
     */
    public ngOnInit() {

        let componentconfig = this.metadata.getComponentConfig('ObjectRelatedDuplicateTile', this.model.module);
        this.fieldset = componentconfig.fieldset;

    }

    /**
     * returns the fields
     */
    private getFields() {
        return this.metadata.getFieldSetFields(this.fieldset);
    }

    /**
     *
     */
    private navigateDetails() {
        this.modal.closeAllModals();
        this.model.goDetail();
    }
}
