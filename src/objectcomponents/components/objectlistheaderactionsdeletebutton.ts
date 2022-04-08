/**
 * @module ObjectComponents
 */
import {Component, Injector} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {backend} from '../../services/backend.service';
import {broadcast} from '../../services/broadcast.service';
import {language} from '../../services/language.service';
import {modellist} from '../../services/modellist.service';
import {modal} from '../../services/modal.service';
import {toast} from '../../services/toast.service';

/**
 * renders an action button as part of a modellist to select and delete records
 */
@Component({
    selector: 'object-list-header-actions-delete-button',
    templateUrl: '../templates/objectlistheaderactionsdeletebutton.html',
})
export class ObjectListHeaderActionsDeleteButton {

    /**
     * the actionconfig passed in fromthe actionset
     */
    public actionconfig: any = {};

    /**
     * defautls to true and is set in ngOnInit
     */
    public hidden: boolean = true;

    constructor(
        public language: language,
        public metadata: metadata,
        public model: model,
        public modellist: modellist,
        public modal: modal,
        public backend: backend,
        public broadcast: broadcast,
        public toast: toast
    ) {
        // set to hidden if we do not have delete right
        if(this.metadata.checkModuleAcl(this.model.module, 'delete')) this.hidden = false;
    }



    /**
     * checks the acl rights for the user to delete
     */
    get disabled() {
        return !this.metadata.checkModuleAcl(this.model.module, 'delete') || this.modellist.getSelectedCount() < 1 || this.modellist.getSelectedCount() > this.maxAllowed;
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
        return this.actionconfig.maxAllowed ? parseInt(this.actionconfig.maxAllowed, 10) : 100;
    }

    /**
     * execute the delete action
     */
    public execute() {
        if (!this.disabled) {
            // check that we can delete at least all entries - 1
            let deleteable = this.modellist.getSelectedItems().filter(i => !i.acl?.delete).length;
            if (deleteable > 0) {
                this.modal.info(this.language.getLabel('MSG_NO_EDIT_RIGHTS', null, 'long'), this.language.getLabel('MSG_NO_EDIT_RIGHTS'));
            } else {
                this.modal.confirm(this.language.getLabelFormatted('MSG_DELETE_RECORDS', [this.modellist.getSelectedCount()], "long"), this.language.getLabel('MSG_DELETE_RECORDS')).subscribe(res => {
                    if (res) {
                        let spinner = this.modal.await('... processing ...');
                        let body = {
                            ids: this.modellist.getSelectedIDs(),
                            action: 'DELETE'
                        };
                        this.backend.patchRequest(`module/${this.model.module}`, {}, body).subscribe(res => {
                                for (let id of this.modellist.getSelectedIDs()) {
                                    this.broadcast.broadcastMessage('model.delete', {
                                        id: id,
                                        module: this.model.module
                                    });
                                }
                                spinner.emit(true);
                            },
                            () => {
                                this.toast.sendToast('ERROR deleting records', 'error');
                                spinner.emit(true);
                            }
                        );
                    }
                });
            }
        }
    }

}

