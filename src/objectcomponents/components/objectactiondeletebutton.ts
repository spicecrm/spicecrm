/**
 * @module ObjectComponents
 */
import {AfterViewInit, Component, Injector, OnDestroy, Optional} from '@angular/core';
import {Router} from '@angular/router';
import {Subscription} from "rxjs";
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {modal} from '../../services/modal.service';
import {toast} from '../../services/toast.service';
import {navigationtab} from '../../services/navigationtab.service';

/**
 * standard actionset item to delete a model
 */
@Component({
    selector: 'object-action-delete-button',
    templateUrl: '../templates/objectactiondeletebutton.html'
})
export class ObjectActionDeleteButton {

    /**
     * if set to true didpslay teh button as icon
     */
    public displayasicon: boolean = false;


    /**
     * holds the action config
     */
    public actionconfig: any = {};

    constructor(
        public metadata: metadata,
        public model: model,
        @Optional() public navigationtab: navigationtab,
        public router: Router,
        public modal: modal,
        public toast: toast,
        public injector: Injector
    ) {

    }

    get disabled(){
        return !this.canDelete;
    }

    /*
    * @return boolean
    */
    get canDelete() {
        try {
            return this.model.checkAccess('delete') && !this.model.isEditing;
        } catch (e) {
            return false;
        }
    }

    /*
    * @confirm delete
    * @delete if answer is true
    */
    public execute() {
        this.modal.confirm('MSG_DELETE_RECORD', 'MSG_DELETE_RECORD')
            .subscribe(answer => {
                if (answer) {
                    this.delete();
                }
            });
    }

    /*
    * @model.delete
    * @navigate to list view
    */
    public delete() {
        this.model.delete().subscribe(
            status => {
                this.completeAction();
            },
            () => {
                this.toast.sendToast('LBL_ERROR_DELETING_RECORD', "error");
            }
        );
    }

    /**
     * completes and redirects to the list except other set in the config
     */
    public completeAction() {
        // if no redirect is supposed to happen return true
        if (this.actionconfig.noredirectoncomplete == true) return;

        // close the tab if we have one
        if (this.navigationtab && this.navigationtab.tabid != 'main') {
            this.navigationtab.closeTab();
        } else {
            this.router.navigate(['/module/' + this.model.module]);
        }
    }

}
