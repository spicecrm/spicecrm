/**
 * @module ObjectComponents
 */

import {Component, OnInit} from '@angular/core';
import {model} from '../../services/model.service';
import {modellist} from '../../services/modellist.service';

@Component({
    selector: 'object-list-header-actions-select-range-modal',
    templateUrl: '../templates/objectlistheaderactionsselectrangemodal.html',
})
export class ObjectListHeaderActionsSelectRangeModal implements OnInit {

    /**
     * reference to the modal self
     *
     * @private
     */
    public self: any;

    /**
     * the range to select from
     *
     * @private
     */
    public from: number = 1;

    /**
     * the range to select to
     *
     * @private
     */
    public to: number;

    constructor(
        public model: model,
        public modellist: modellist
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
    public close() {
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

    public select() {
        if (this.canSelect) {
            this.modellist.setRangeSelected(this.from, this.to);
            this.close();
        }
    }
}

