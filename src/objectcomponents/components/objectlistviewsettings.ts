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
    templateUrl: '../templates/objectlistviewsettings.html',

})
export class ObjectListViewSettings {

    constructor(
        public language: language,
        public elementRef: ElementRef,
        public modal: modal,
        public modellist: modellist,
        public renderer: Renderer2,
        public injector: Injector,
        public toast: toast
    ) {
    }

    public add() {
        this.modal.openModal('ObjectListViewSettingsAddlistModal', true, this.injector).subscribe(modalref => {
            modalref.instance.modalmode = 'add';
        });
    }

    public edit() {
        if (!this.modellist.checkAccess('edit')) {
            return false;
        }

        this.modal.openModal('ObjectListViewSettingsAddlistModal', true, this.injector).subscribe(modalref => {
            modalref.instance.modalmode = 'edit';
        });
    }

    public save() {
        this.modellist.updateListType().subscribe(saved => {
            this.toast.sendToast('List Saved');
        });
    }

    public setfields() {
        if (!this.modellist.checkAccess('edit')) {
            return false;
        }
        this.modal.openModal('ObjectListViewSettingsSetfieldsModal', true, this.injector);
    }

    public delete() {
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
