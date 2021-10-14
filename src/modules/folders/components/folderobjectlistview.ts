import { Component, ViewChild, ViewContainerRef } from "@angular/core";

@Component({
    selector: 'folder-object-listview',
    templateUrl : './src/modules/folders/templates/folderobjectlistview.html'
})

export class FolderObjectListView {

    @ViewChild('listContainer', {read: ViewContainerRef, static: true}) private listContainer: ViewContainerRef;

    private folderId: string = null;

    /*
    * getting folder id
    * */
    private setFolderId( folderId ) {
        this.folderId = folderId;
    }

}
