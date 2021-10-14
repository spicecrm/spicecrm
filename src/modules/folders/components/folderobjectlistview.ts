import { Component } from "@angular/core";

@Component({
    selector: 'folder-object-listview',
    templateUrl : './src/modules/folders/templates/folderobjectlistview.html'
})

export class FolderObjectListView {

    private folderId: string = null;

    /*
    * getting folder id
    * */
    private setFolderId( folderId ) {
        this.folderId = folderId;
    }

}
