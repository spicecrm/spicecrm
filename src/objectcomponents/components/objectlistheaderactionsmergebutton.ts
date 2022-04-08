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
    selector: 'object-list-header-actions-merge-button',
    templateUrl: '../templates/objectlistheaderactionsmergebutton.html',
})
export class ObjectListHeaderActionsMergeButton {

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
        return !this.metadata.checkModuleAcl(this.model.module, 'delete') || this.modellist.getSelectedCount() < 1 || this.modellist.getSelectedCount() > this.maxAllowed;
    }

    /**
     * returns the ax entries allowed to merge. if no value is set this is hardcoded assumed to be 3
     */
    get maxAllowed() {
        return this.actionconfig.maxAllowed ? parseInt(this.actionconfig.maxAllowed, 10) : 3;
    }

    /**
     * returns the number of sleected items or all in the modellist
     */
    get mergeCount() {
        return this.modellist.getSelectedCount();
    }

    public execute() {
        if (!this.disabled) {
            // check that we can delete at least all entries - 1
            let deletable = this.modellist.getSelectedItems().filter(i => i.acl?.delete).length;
            if (deletable < this.modellist.getSelectedCount() - 1) {
                this.modal.info(this.language.getLabel('MSG_NO_MERGE_DELETE', null, 'long'), this.language.getLabel('MSG_NO_MERGE_DELETE'));
            } else {
                this.modal.openModal('ObjectMergeModal', true, this.injector).subscribe(modalRef => {
                    modalRef.instance.mergemodels = this.modellist.getSelectedItems();
                });
            }
        }
    }

}

