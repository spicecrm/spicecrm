import {Component, EventEmitter, Input, Output} from "@angular/core";
import {take} from "rxjs/operators";
import {language} from "../../../services/language.service";
import {backend} from "../../../services/backend.service";
import {toast} from "../../../services/toast.service";

@Component({
    selector: "folder-view-tree-item",
    templateUrl: "./src/modules/folders/templates/folderviewitems.html"
})

export class FolderViewTreeItems {

constructor(private language: language,
            private backend: backend,
            private toast: toast
            ) {
}
    /*
    * @output onItemAdd: object
    * {
    *   id: string = parentId,
    *   name: string = parentName
    * }
    */
    @Output() public onItemAdd: EventEmitter<any> = new EventEmitter<any>();
    /*
  * @output onItemDelete: object
  * {
  *   id: string = parentId,
  *   name: string = parentName
  * }
  */
    @Output() public onItemDelete: EventEmitter<any> = new EventEmitter<any>();
    /*
    * @output toggleExpandedChange: string = item.id
    */
    @Output() public toggleExpandedChange: EventEmitter<any> = new EventEmitter<any>();
    /*
    * @input item: object
    * {
    *     id: string,
    *     parent_id: string,
    *     parent_sequence: number,
    *     name: string,
    *     systemTreeDefs: object
    * }
    */
    @Input() public item: any = [];
    /*
    * @input config: object
    */
    @Input() private config: any = {};

    /*
    * @param parentId: string
    * @param parentName: string
    * @emit object by @Output onItemAdd
    */
    public addItem(parentId, parentName) {
        this.onItemAdd.emit({id: parentId, name: parentName});
    }

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

    public deleteFolder() {
        this.backend.deleteRequest('module/Folders/' + this.item.id)
            .pipe(take(1))
            .subscribe(data => {
              this.onItemDelete.emit();
              this.toast.sendToast(this.language.getLabel("MSG_SUCCESSFULLY_DELETED"), "success");
            });
    }

}
