/**
 * @module ObjectComponents
 */

import {Component, Injector} from '@angular/core';
import {model} from '../../services/model.service';
import {modellist} from '../../services/modellist.service';
import {modal} from '../../services/modal.service';

@Component({
    selector: 'object-list-header-actions-select-range-button',
    templateUrl: './src/objectcomponents/templates/objectlistheaderactionsselectrangebutton.html',
})
export class ObjectListHeaderActionsSelectRangeButton {

    /**
     * defautls to true and is set in ngOnInit
     */
    public hidden: boolean = false;

    constructor(
        private model: model,
        private modellist: modellist,
        private modal: modal,
        private injector: Injector
    ) {
    }

    get disabled(): boolean {
        return this.modellist.listData.list.length == 0;
    }

    public execute() {
        this.modal.openModal('ObjectListHeaderActionsSelectRangeModal', true, this.injector);
    }
}

