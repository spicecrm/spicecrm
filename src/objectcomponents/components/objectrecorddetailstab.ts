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
 * @module ObjectComponents
 */

import {Component, OnInit} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {language} from '../../services/language.service';

/**
 * renders a tab item with a fieldset as part of the details view on a model
 *
 * in any case requires a component that provides a view and a model
 */
@Component({
    selector: 'object-record-details-tab',
    templateUrl: './src/objectcomponents/templates/objectrecorddetailstab.html'
})
export class ObjectRecordDetailsTab implements OnInit {

    /**
     * @ignore
     */
    private componentconfig: any = {};

    /**
     * defines if the panel is expanded or collapsed. Expanded by default
     */
    private expanded: boolean = true;

    constructor(private metadata: metadata, private model: model, private language: language) {
    }

    /**
     * @ignore
     */
    public ngOnInit() {
        if (this.componentconfig.collapsed) {
            this.expanded = false;
        }
    }

    /**
     * simple getter to get the fieldset id from teh componentconfig
     */
    get fieldSet() {
        try {
            return this.componentconfig.fieldset;
        } catch (e) {
            return '';
        }
    }

    /**
     * a simple getter for the componentconfig to determine if the label should be shown or hidden
     */
    get showTitle() {
        try {
            return !this.componentconfig.hidelabel;
        } catch (e) {
            return false;
        }
    }

    /**
     * determine if the panel as such is hidden
     *
     * this is mainly driven by the required model state
     */
    get hidden() {
        return (this.componentconfig.requiredmodelstate && !this.model.checkModelState(this.componentconfig.requiredmodelstate));
    }
}
