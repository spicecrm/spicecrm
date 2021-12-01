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
    selector: 'object-list-header-actions-unselect-all-button',
    templateUrl: '../templates/objectlistheaderactionsunselectallbutton.html',
})
export class ObjectListHeaderActionsUnselectAllButton {

    /**
     * only "hidden" in use
     */
    public disabled: boolean = false;

    constructor(
        public language: language,
        public metadata: metadata,
        public model: model,
        public modellist: modellist,
        public modal: modal
    ) {
    }

    get hasSelection() {
        return this.modellist.getSelectedCount() > 0;
    }

    get hidden() {
        return !this.hasSelection;
    }

    public execute() {
        this.modellist.setAllUnselected();
    }
}

