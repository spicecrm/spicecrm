import { AfterViewInit, Component, Input, OnInit, ViewChild, ViewContainerRef } from "@angular/core";
import { metadata } from '../../../services/metadata.service';
import { modellist } from '../../../services/modellist.service';

@Component({
    selector: 'folder-object-listview',
    templateUrl : './src/modules/folders/templates/folderobjectlistview.html'
})

export class FolderObjectListView {

    @ViewChild('listContainer', {read: ViewContainerRef, static: true}) private listContainer: ViewContainerRef;

    constructor( private metadata: metadata, private modellist: modellist ) { }

}
