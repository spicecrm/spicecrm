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
import {
    Component,
    ElementRef, Input, OnInit
} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {modellist} from '../../services/modellist.service';

/**
 * component being part of the ObjectListViewAggregate .. renders the value of the aggregate and a checkbox
 */
@Component({
    selector: 'object-listview-aggregate-item',
    templateUrl: './src/objectcomponents/templates/objectlistviewaggregateitem.html'
})
export class ObjectListViewAggregateItem {

    /**
     * ths item in teh bucket
     */
    @Input() private bucketitem: any = {};

    /**
     * the aggregate we are actually on
     */
    @Input() private aggregate: any = {};

    /**
     * internal flag if the claue is checked
     */
    private isChecked: boolean = false;

    constructor(private elementRef: ElementRef, private language: language, private metadata: metadata, private modellist: modellist) {

    }

    /**
     * gets the name of the aggregate
     */
    get aggregatename() {
        return this.aggregate.indexfieldname?.replace(/>/g, '');
    }

    /**
     * returns if the modellist is loading and thus disabled the checkboxes
     */
    get loading() {
        return this.modellist.isLoading;
    }

    /**
     * a setter for the checked value of teh checkbox. A change triggers teh set int eh listservice and a refiltering
     *
     * @param value
     */
    set checked(value) {
        this.isChecked = value;
        if (value) {
            this.modellist.setAggregate(this.aggregatename, this.bucketitem.aggdata);
            this.modellist.reLoadList();
        } else {
            const removed = this.modellist.removeAggregate(this.aggregatename, this.bucketitem.aggdata);
            if (removed) this.modellist.reLoadList();
        }
    }

    /**
     * the getter for the checkvox value
     */
    get checked() {
        return this.modellist.checkAggregate(this.aggregatename, this.bucketitem.aggdata);
    }
}
