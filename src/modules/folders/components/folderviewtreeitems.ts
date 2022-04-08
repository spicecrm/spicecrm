import {Component, EventEmitter, Input, Output} from "@angular/core";
import {take} from "rxjs/operators";
import {language} from "../../../services/language.service";
import {backend} from "../../../services/backend.service";
import {toast} from "../../../services/toast.service";
import { modal } from '../../../services/modal.service';

@Component({
    selector: "folder-view-tree-item",
    templateUrl: "../templates/folderviewitems.html"
})

export class FolderViewTreeItems {

constructor( public language: language, public backend: backend, public toast: toast, public modal: modal ) { }

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

    public editFolderName(): void {
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
