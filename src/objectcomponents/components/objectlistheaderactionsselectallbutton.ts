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
    templateUrl: './src/objectcomponents/templates/objectlistheaderactionsselectallbutton.html',
})
export class ObjectListHeaderActionsSelectAllButton {

    public disabled: boolean = false;
    /**
     * defautls to true and is set in ngOnInit
     */
    public hidden: boolean = false;

    constructor(
        private language: language,
        private metadata: metadata,
        private model: model,
        private modellist: modellist,
        private modal: modal
    ) {
    }

    public execute() {
        this.modellist.setAllSelected();
    }
}

