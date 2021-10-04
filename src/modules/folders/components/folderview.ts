import {Component} from "@angular/core";
import {FoldersService} from "../services/folders.service";


@Component({
    selector: 'folder-view',
    templateUrl : './src/modules/folders/templates/folderview.html',
    providers: [FoldersService]
})

export class FolderView {


}
