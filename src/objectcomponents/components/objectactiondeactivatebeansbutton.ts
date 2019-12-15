/**
 * @module ObjectComponents
 */
import {Component, Optional, Injector, OnInit} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {modal} from "../../services/modal.service";
import {modalwindow} from "../../services/modalwindow.service";
import {modellist} from "../../services/modellist.service";


/**
 * This component shows the ObjectActionMergeBeansButton; It opens the "objectactiondeactivatebeansmodal"
 */
@Component({
    selector: 'object-action-deactivate-beans-button',
    templateUrl: './src/objectcomponents/templates/objectactiondeactivatebeansbutton.html'
})
export class ObjectActionDeactivateBeansButton {

    /**
     * the actionconfig passed in from the actionset
     */
    public actionconfig: any;

    /**
     * to sneure the user cannot click twice
     */
    private saving: boolean = false;

    private selectedItems: any = [];

    constructor(
        private language: language,
        private metadata: metadata,
        private modal: modal,
        private injector: Injector,
        private modellist: modellist,
        @Optional() private modalwindow: modalwindow
    ) {

    }

    get disabled() {
        // return this.model.checkAccess('edit') && this.model.checkAccess('deactivate') ? false : true;
        return false;
    }

    get hasSelection() {
        return this.modellist.getSelectedCount() > 1;
    }

    get hidden() {
        return !this.hasSelection;
    }

    /**
     * Click:
     */
    public execute() {
        if (this.saving) return;

        this.selectedItems = this.modellist.getSelectedItems();

        this.modal.openModal('ObjectActionDeactivateBeansModal', true, this.injector).subscribe(editModalRef => {
            if (editModalRef) {
                editModalRef.instance.selectedItems = this.selectedItems;
                editModalRef.instance.module = this.modellist.module;
            }
        });
    }
}





