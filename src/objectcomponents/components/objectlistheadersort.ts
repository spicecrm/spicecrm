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
import {Component, Input, OnInit} from '@angular/core';
import {language} from '../../services/language.service';
import {modellist} from '../../services/modellist.service';
import {view} from '../../services/view.service';

/**
 * renders the header row for a list view table
 */
@Component({
    selector: 'object-list-header-sort',
    templateUrl: './src/objectcomponents/templates/objectlistheadersort.html'
})
export class ObjectListHeaderSort {
    /**
     * the field we are displaying
     */
    @Input() private field: any;


    constructor(private modellist: modellist) {

    }

    /**
     * a getter to return the module from the modellist service
     */
    get module() {
        return this.modellist.module;
    }

    /**
     * returns if a given fielsd is set sortable in teh fieldconfig
     *
     * @param field the field from the fieldset
     */
    get isSortable(): boolean {
        if (this.field.fieldconfig.sortable === true) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * a helper function to determine the sort icon based on the set sort criteria
     */
    get sortIcon(): string {
        let sortdata = this.modellist.getSortField(this.field.field);
        if(sortdata) {
            if (sortdata.sortdirection == 'ASC') {
                return 'arrowdown';
            } else {
                return 'arrowup';
            }
        }
        return '';
    }

    get sortindex() {
        let sortdata = this.modellist.getSortField(this.field.field);
        if(sortdata && sortdata.sortitems > 1) {
            return sortdata.sortindex + 1;
        }
        return '';
    }

}
