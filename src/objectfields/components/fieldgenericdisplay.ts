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
 * @module ObjectFields
 */
import {Component, Input, Optional} from '@angular/core';
import {model} from '../../services/model.service';
import {navigationtab} from '../../services/navigationtab.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';

/**
 * a generic container for a field to be displayed
 */
@Component({
    selector: 'field-generic-display',
    templateUrl: './src/objectfields/templates/fieldgenericdisplay.html'
})
export class fieldGenericDisplay {
    // @Input() public value: string = '';
    /**
     * determines if the field is editbale and thus the edit pen is displayed
     */
    @Input() public editable: boolean = false;

    /**
     * hand over the fieldconfig
     */
    @Input() public fieldconfig: any = {};

    /**
     * an optional class or string of classes that is applied to the field wrapper
     */
    @Input() public fielddisplayclass: string = '';

    /**
     * the id of the field. This needs to be passed in
     */
    @Input() public fieldid: string = '';

    /**
     * internal variable for the truncation setting of the field
     * @private
     */
    private _truncate: boolean = true;

    /**
     * an attribute to disable truncation on the field
     *
     * @param value
     */
    @Input('field-generic-display-notruncate') set truncate(value) {
        this._truncate = false;
    }

    constructor(
        public model: model,
        public view: view,
        public language: language,
        @Optional() private navigationtab: navigationtab
    ) {
    }

    /**
     * simple getter to check if we are in editmore
     */
    public isEditMode() {
        if (this.view.isEditMode() && this.editable) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * returns the max with for the ngStyle directive
     */
    get fieldMaxWidth() {
        if (this.editable) {
            return {
                'max-width': 'calc(100% - 20px)'
            };
        }
    }

    /**
     * simple getter to determine if the field has a link, the view allows for links and if the user has ACL rights to navigate to thte the of the record
     */
    get link() {
        try {
            return this.fieldconfig.link && this.model.checkAccess('detail');
        } catch (e) {
            return false;
        }
    }

    /**
     * sets the model and the viewinto edit mode
     */
    public setEditMode() {
        if (this.editable) {
            this.model.startEdit();
            this.view.setEditMode(this.fieldid);
        }
    }

    /**
     * navigates from teh linkto the record
     */
    public goRecord() {
        if (this.link) {
            this.model.goDetail(this.navigationtab?.tabid);
        }
    }

}

