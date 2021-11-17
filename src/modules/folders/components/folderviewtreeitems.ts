/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

import {Component, EventEmitter, Input, Output} from "@angular/core";
import {take} from "rxjs/operators";
import {language} from "../../../services/language.service";
import {backend} from "../../../services/backend.service";
import {toast} from "../../../services/toast.service";
import { modal } from '../../../services/modal.service';

@Component({
    selector: "folder-view-tree-item",
    templateUrl: "./src/modules/folders/templates/folderviewitems.html"
})

export class FolderViewTreeItems {

constructor( private language: language, private backend: backend, private toast: toast, private modal: modal ) { }

    /*
    * @output onFolderAdd: object
    * {
    *   id: string = parentId,
    *   name: string = parentName
    * }
    */
    @Output() public onFolderAdd = new EventEmitter<string>();

    /*
    * Trigger the parent component to sort the folder list.
    */
    @Output() public doSort = new EventEmitter<void>();

    /*
     * @output onItemDelete
  */
    @Output() public onFolderDelete: EventEmitter<any> = new EventEmitter<any>();

    /*
    * @output toggleExpandedChange: string = item.id
    */
    @Output() public toggleExpandedChange: EventEmitter<any> = new EventEmitter<any>();

    /*
    * @input item: object
    * {
    *     id: string,
    *     parent_id: string,
    *     name: string,
    *     systemTreeDefs: object
    * }
    */
    @Input() public item: any;

    /*
    * @param item: object
    * @param e?: MouseEvent
    * @stop MouseEvent propagation
    * @emit object: {id: string = parentId, name: string = parentName} by @output onItemAdd
    */
    public expand(item, e?) {
        this.toggleExpandedChange.emit(item.id);
        if (e && e.stopPropagation) e.stopPropagation();
    }

    /*
    * delete child folder with backend request
     */
    public deleteFolder() {
        this.backend.deleteRequest('module/Folders/' + this.item.id)
            .pipe(take(1))
            .subscribe(data => {
              this.onFolderDelete.emit();
              this.toast.sendToast(this.language.getLabel("MSG_SUCCESSFULLY_DELETED"), "success");
            });
    }

        /*
        * edit name of folder with backend request
         */

    private editFolderName(): void {
        this.modal.prompt('input', null, 'Folder Name', null, this.item.name ).pipe(take(1)).subscribe(folderName => {
            folderName = folderName.trim();
            if ( folderName ) {
                this.item.name = folderName;
                let folder = {
                    name: this.item.name
                };
                this.backend.postRequest('module/Folders/'+this.item.id, {}, folder)
                    .pipe(take(1))
                    .subscribe(asdf => {
                        this.toast.sendToast(this.language.getLabel('MSG_FOLDERNAME_CHANGED'), 'success');
                        this.doSort.emit();
                    },
                    error => {
                        this.toast.sendToast(this.language.getLabel('LBL_ERROR'), 'error');
                    });
            }
        });
    }

}
