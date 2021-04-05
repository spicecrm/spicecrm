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
import {
    Component,
    Input, OnInit
} from '@angular/core';
import {model} from '../../services/model.service';
import {language} from '../../services/language.service';
import {modellist} from '../../services/modellist.service';

/**
 * a componentn that displays one set of aggregtaes returned from the Elastic Search
 */
@Component({
    selector: 'object-listview-aggregate',
    templateUrl: './src/objectcomponents/templates/objectlistviewaggregate.html'
})
export class ObjectListViewAggregate {

    /**
     * an input for teh aggregate itself
     */
    @Input() public aggregate: any = {};

    constructor(public language: language, public modellist: modellist, public model: model) {
    }

    /**
     * returns the items for teh display of the source of teh aggregate
     *
     * This is
     *  - the module if different ot the model
     *  - the fieldname
     */
    get aggregateNameItems(): string[] {
        let nameItems = [];
        if (this.aggregate.fielddetails) {
            if (this.model.module != this.aggregate.fielddetails.module) {
                nameItems.push(this.language.getModuleName(this.aggregate.fielddetails.module, true));
            }

            nameItems.push(this.language.getFieldDisplayName(this.aggregate.fielddetails.module, this.aggregate.fielddetails.field));
        }
        return nameItems;
    }

    /**
     * gets the name of the aggregate
     */
    get aggregatename() {
        return this.aggregate.indexfieldname?.replace(/>/g, '');
    }

    /**
     * returns the buckets from the modellist service
     */
    get aggregateBuckets() {
        if (this.aggregatename && this.modellist.searchAggregates?.[this.aggregatename]) {
            return this.modellist.searchAggregates?.[this.aggregatename].buckets;
        } else {
            return [];
        }
    }

    /**
     * returns the count of the documents not considered in teh aggregate
     */
    get otherDocCount() {
        if (this.aggregatename && this.modellist.searchAggregates?.[this.aggregatename]) {
            return this.modellist.searchAggregates?.[this.aggregatename].sum_other_doc_count;
        } else {
            return 0;
        }
    }

    /**
     * returns the number of the checked aggregates
     */
    get checkdCount() {
        return this.modellist.getCheckedAggregateCount(this.aggregatename);
    }

    /**
     * returns if the aggregate is collapsed
     */
    get collapsed() {
        return !!this.aggregate.collapsed;
    }

    /**
     * toggles the collapsed status
     */
    private toggleCollapsed() {
        this.aggregate.collapsed = !this.aggregate.collapsed;
    }
}
