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
    Input
} from '@angular/core';
import {model} from '../../services/model.service';
import {language} from '../../services/language.service';
import {modellist} from '../../services/modellist.service';
import {ObjectListViewAggregate} from './objectlistviewaggregate';

/**
 * renders a container with the tags returned as aggregates from teh elastic qewury. This also allows filtering by clicking on any of the tags
 */
@Component({
    selector: 'object-listview-tags-aggregate',
    templateUrl: './src/objectcomponents/templates/objectlistviewtagsaggregate.html'
})
export class ObjectListViewTagsAggregate extends ObjectListViewAggregate {

    public aggregate = {
        indexfieldname: 'tags'
    }

    constructor(public language: language, public modellist: modellist, public model: model) {
        super(language, modellist, model);
    }

    /**
     * a simple getter to check if there are any buckets on teh aggegarete. If not a message is renderesd that no records are tagged
     */
    get hasItems() {
        try {
            return this.aggregateBuckets.length > 0;
        } catch (e) {
            return false;
        }
    }

    /**
     * returns if the current item (tag) is active
     * @param tag the item record from the elastic response
     */
    private isactive(tag) {
        return this.modellist.checkAggregate('tags', tag.aggdata);
    }

    /**
     * toggles a tag active or inactive
     *
     * @param tag the item record from the elastic response
     */
    private toggle(tag) {
        if (!this.isactive(tag)) {
            this.modellist.setAggregate('tags', tag.aggdata);
            this.modellist.reLoadList();
        } else {
            const removed = this.modellist.removeAggregate('tags', tag.aggdata);
            if (removed) this.modellist.reLoadList();
        }
    }
}
