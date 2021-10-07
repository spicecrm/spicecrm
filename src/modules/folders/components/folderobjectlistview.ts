import { AfterViewInit, Component, Input, OnInit } from "@angular/core";
import { metadata } from '../../../services/metadata.service';
import { modellist } from '../../../services/modellist.service';

@Component({
    selector: 'folder-object-listview',
    templateUrl : './src/modules/folders/templates/folderobjectlistview.html'
})

export class FolderObjectListView {

    constructor( private metadata: metadata, private modellist: modellist ) {}

}
