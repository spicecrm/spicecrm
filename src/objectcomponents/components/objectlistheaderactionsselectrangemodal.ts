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

