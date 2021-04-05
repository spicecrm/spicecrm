/*
SpiceUI 2021.01.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

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
    templateUrl: "./src/objectcomponents/templates/objectfileactionmenu.html"
})
export class ObjectFileActionMenu {

    @Input() private file: any;

    constructor(private broadcast: broadcast,
                private modelattachments: modelattachments,
                private language: language,
                private elementRef: ElementRef,
                private modalservice: modal,
                private injector: Injector) {

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

    /**
     * open edit modal and fill in the input data
     * @private
     */
    private edit() {
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
