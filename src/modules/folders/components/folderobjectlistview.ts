import { Component } from "@angular/core";

@Component({
    selector: 'folder-object-listview',
    templateUrl : '../templates/folderobjectlistview.html'
})

export class FolderObjectListView {

    public folderId: string = null;

    /*
    * getting folder id
    * */
    public setFolderId( folderId ) {
        this.folderId = folderId;
    }

}
