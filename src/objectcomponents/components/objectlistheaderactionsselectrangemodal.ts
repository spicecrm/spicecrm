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

import {Component, OnInit} from '@angular/core';
import {model} from '../../services/model.service';
import {modellist} from '../../services/modellist.service';

@Component({
    selector: 'object-list-header-actions-select-range-modal',
    templateUrl: './src/objectcomponents/templates/objectlistheaderactionsselectrangemodal.html',
})
export class ObjectListHeaderActionsSelectRangeModal implements OnInit {

    /**
     * reference to the modal self
     *
     * @private
     */
    private self: any;

    /**
     * the range to select from
     *
     * @private
     */
    private from: number = 1;

    /**
     * the range to select to
     *
     * @private
     */
    private to: number;

    constructor(
        private model: model,
        private modellist: modellist
    ) {
    }

    /**
     * on initialization set the to number to the number of records in the list
     */
    public ngOnInit() {
        this.to = this.modellist.listData.list.length;
    }

    /**
     * close the modal
     *
     * @private
     */
    private close() {
        this.self.destroy();
    }

    /**
     * determine if we can select the range
     */
    get canSelect() {
        // both values need to be set
        if (!this.from || !this.to) return false;

        // only positive values
        if(this.from < 1 || this.to < 1) return false;


        if (this.to <= this.from) return false;

        if (this.to > this.modellist.listData.list.length) return false;

        return true;
    }

    private select() {
        if (this.canSelect) {
            this.modellist.setRangeSelected(this.from, this.to);
            this.close();
        }
    }
}

