/**
 * @module ObjectComponents
 */

import {Component} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {language} from '../../services/language.service';
import {modellist} from '../../services/modellist.service';
import {modal} from '../../services/modal.service';

@Component({
    selector: 'object-list-header-actions-select-all-button',
    templateUrl: '../templates/objectlistheaderactionsselectallbutton.html',
})
export class ObjectListHeaderActionsSelectAllButton {

    /**
     * defautls to true and is set in ngOnInit
     */
    public hidden: boolean = false;

    constructor(
        public language: language,
        public metadata: metadata,
        public model: model,
        public modellist: modellist,
        public modal: modal
    ) {
    }

    get disabled(): boolean {
        return this.modellist.listData.list.length == 0;
    }

    public execute() {
        this.modellist.setAllSelected();
    }
}

