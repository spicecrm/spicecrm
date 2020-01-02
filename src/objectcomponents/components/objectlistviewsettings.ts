/**
 * @module ObjectComponents
 */
import {Component, ElementRef, Renderer2, Injector} from '@angular/core';
import {modellist} from '../../services/modellist.service';
import {modal} from '../../services/modal.service';
import {toast} from '../../services/toast.service';
import {language} from '../../services/language.service';
import {ObjectListViewSettingsAddlistModal} from "./objectlistviewsettingsaddlistmodal";
import {ObjectListViewSettingsSetfieldsModal} from "./objectlistviewsettingssetfieldsmodal";

@Component({
    selector: 'object-listview-settings',
    templateUrl: './src/objectcomponents/templates/objectlistviewsettings.html',

})
export class ObjectListViewSettings {

    constructor(
        private language: language,
        private elementRef: ElementRef,
        private modal: modal,
        private modellist: modellist,
        private renderer: Renderer2,
        private injector: Injector,
        private toast: toast
    ) {
    }

    private add() {
        this.modal.openModal('ObjectListViewSettingsAddlistModal').subscribe(modalref => {
            modalref.instance.modellist = this.modellist;
            modalref.instance.modalmode = 'add';
        });
    }

    private edit() {
        if (!this.modellist.checkAccess('edit')) {
            return false;
        }

        this.modal.openModal('ObjectListViewSettingsAddlistModal').subscribe(modalref => {
            modalref.instance.modellist = this.modellist;
            modalref.instance.modalmode = 'edit';
        });
    }

    private save() {
        this.modellist.updateListType({}).subscribe(saved => {
            this.toast.sendToast('List Saved');
        });
    }

    private setfields() {
        if (!this.modellist.checkAccess('edit')) {
            return false;
        }
        this.modal.openModal('ObjectListViewSettingsSetfieldsModal', true, this.injector);
    }

    private delete() {
        if (!this.modellist.checkAccess('delete')) {
            return false;
        }

        this.modal.prompt("confirm", this.language.getLabel('MSG_DELETE_RECORD', undefined, 'long'), this.language.getLabel('MSG_DELETE_RECORD')).subscribe(answer => {
            if (answer) {
                this.modellist.deleteListType();
            }
        });
    }

}
