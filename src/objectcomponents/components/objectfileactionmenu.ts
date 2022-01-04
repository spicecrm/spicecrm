/**
 * @module ObjectComponents
 */
import {Component, ElementRef, Injector, Input} from "@angular/core";
import {language} from "../../services/language.service";
import {modelattachments} from "../../services/modelattachments.service";
import {broadcast} from "../../services/broadcast.service";
import {modal} from '../../services/modal.service';

/**
 * renders the action menu for the attachment
 */
@Component({
    selector: "object-file-action-menu",
    templateUrl: "../templates/objectfileactionmenu.html"
})
export class ObjectFileActionMenu {

    @Input() public file: any;

    constructor(public broadcast: broadcast,
                public modelattachments: modelattachments,
                public language: language,
                public elementRef: ElementRef,
                public modalservice: modal,
                public injector: Injector) {

    }

    /**
     * determines where the menu is opened
     */
    public getDropdownLocationClass() {
        let rect = this.elementRef.nativeElement.getBoundingClientRect();
        if (window.innerHeight - rect.bottom < 100) {
            return "slds-dropdown--bottom";
        }
    }

    /**
     * action to delete the file
     *
     * ToDo: add ACL Check
     */
    public deleteFile() {
        this.modalservice.confirm(this.language.getLabel('QST_DELETE_FILE'), this.language.getLabel('QST_DELETE_FILE', null, 'short')).subscribe((answer) => {
            if (answer) this.modelattachments.deleteAttachment(this.file.id);
        });
    }

    /**
     * triggers the download of the file
     */
    public downloadFile() {
        this.modelattachments.downloadAttachment(this.file.id, this.file.name);
    }

    /**
     * open edit modal and fill in the input data
     * @private
     */
    public edit() {
        this.modalservice.openModal('SpiceAttachmentsEditModal', true, this.injector).subscribe(
            modalRef => {
                modalRef.instance.attachment = this.file;
                modalRef.instance.inputData = {
                    text: this.file.text,
                    display_name: this.file.display_name,
                    category_ids: !this.file.category_ids ? [] : this.file.category_ids.split(',')
                };
            }
        );
    }
}
