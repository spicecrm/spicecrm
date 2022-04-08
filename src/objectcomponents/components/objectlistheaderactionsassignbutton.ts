/**
 * @module ObjectComponents
 */

/**
 * @ignore
 */
declare var moment: any;

import {Component, Injector} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {language} from '../../services/language.service';
import {modellist} from '../../services/modellist.service';
import {modal} from '../../services/modal.service';

/**
 * renders an action button as part of a modellist to select and merge records
 */
@Component({
    selector: 'object-list-header-actions-assign-button',
    templateUrl: '../templates/objectlistheaderactionsassignbutton.html',
})
export class ObjectListHeaderActionsAssignButton {

    /**
     * the actionconfig passed in fromthe actionset
     */
    public actionconfig: any = {};

    /**
     * defautls to true and is set in ngOnInit
     */
    public hidden: boolean = false;

    constructor(
        public language: language,
        public metadata: metadata,
        public model: model,
        public modellist: modellist,
        public modal: modal,
        public injector: Injector
    ) {
    }

    /**
     * checks the acl rights for the user to export and that we have some items selected
     */
    get disabled() {
        return !this.metadata.checkModuleAcl(this.model.module, 'edit') || this.modellist.getSelectedCount() < 1 || this.modellist.getSelectedCount() > this.maxAllowed;
    }

    /**
     * returns the number of sleected items or all in the modellist
     */
    get selectedCount() {
        return this.modellist.getSelectedCount();
    }

    /**
     * returns the ax entries allowed to merge. if no value is set this is hardcoded assumed to be 50
     */
    get maxAllowed() {
        return this.actionconfig.maxAllowed ? parseInt(this.actionconfig.maxAllowed, 10) : 50;
    }

    public execute() {
        if (!this.disabled) {
            // check that we can delete at least all entries - 1
            let editable = this.modellist.getSelectedItems().filter(i => !i.acl?.edit).length;
            if (editable >0) {
                this.modal.info(this.language.getLabel('MSG_NO_EDIT_RIGHTS', null, 'long'), this.language.getLabel('MSG_NO_EDIT_RIGHTS'));
            } else {
                this.modal.openModal('ObjectListHeaderActionsAssignModal', true, this.injector);
            }
        }
    }

}

