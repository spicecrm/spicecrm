/**
 * @module ObjectComponents
 */
import {Component, ElementRef, Input, Renderer} from "@angular/core";
import {language} from "../../services/language.service";
import {modelattachments} from "../../services/modelattachments.service";
import {popup} from "../../services/popup.service";
import {broadcast} from "../../services/broadcast.service";
import {modal} from '../../services/modal.service';

/**
 * renders the action menu for the attachment
 */
@Component({
    selector: "object-file-action-menu",
    templateUrl: "./src/objectcomponents/templates/objectfileactionmenu.html"
})
export class ObjectFileActionMenu {

    @Input() private file: any;

    constructor(private broadcast: broadcast, private modelattachments: modelattachments, private language: language, private elementRef: ElementRef, private renderer: Renderer, private modalservice: modal) {

    }

    /**
     * determines where the menu is opened
     */
    private getDropdownLocationClass() {
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
    private deleteFile() {
        this.modalservice.confirm(this.language.getLabel('QST_DELETE_FILE'), this.language.getLabel('QST_DELETE_FILE', null, 'short')).subscribe((answer) => {
            if (answer) this.modelattachments.deleteAttachment(this.file.id);
        });
    }

    /**
     * triggers the download of the file
     */
    private downloadFile() {
        this.modelattachments.downloadAttachment(this.file.id, this.file.name);
    }
}
