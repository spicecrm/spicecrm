/**
 * @module ObjectComponents
 */
import {Component, ElementRef, Renderer2} from '@angular/core';
import {modellist} from '../../services/modellist.service';
import {modal} from '../../services/modal.service';
import {language} from '../../services/language.service';
import {ObjectListViewSettingsAddlistModal} from "./objectlistviewsettingsaddlistmodal";
import {ObjectListViewSettingsSetfieldsModal} from "./objectlistviewsettingssetfieldsmodal";

@Component({
    selector: 'object-listview-settings',
    templateUrl: './src/objectcomponents/templates/objectlistviewsettings.html',

})
export class ObjectListViewSettings {
    private showMenu: boolean = false;
    private clickListener: any;

    constructor(
        private language: language,
        private elementRef: ElementRef,
        private modal: modal,
        private modellist: modellist,
        private renderer: Renderer2
    ) {}

    private toggleMenu() {
        this.showMenu = !this.showMenu;

        if (this.showMenu) {
            this.clickListener = this.renderer.listen('document', 'click', (event) => this.onClick(event));
        } else if (this.clickListener) {
            this.clickListener();
        }
    }

    public onClick(event: MouseEvent): void {
        const clickedInside = this.elementRef.nativeElement.contains(event.target);
        if (!clickedInside) {
            this.showMenu = false;
            this.clickListener();
        }
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

    private setfields() {
        if (!this.modellist.checkAccess('edit')) {
            return false;
        }

        this.modal.openModal('ObjectListViewSettingsSetfieldsModal').subscribe(modalref => {
            modalref.instance.modellist = this.modellist;
        });
    }

    private delete() {
        if (!this.modellist.checkAccess('delete')) {
            return false;
        }

        this.modal.openModal('ObjectListViewSettingsDeletelistModal').subscribe(modalref => {
            modalref.instance.modellist = this.modellist;
        });
    }

}
