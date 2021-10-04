/**
 * @module ModuleFolders
 */
import {CommonModule} from "@angular/common";
import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";

import {userpreferences} from "../../services/userpreferences.service";

import {ObjectFields} from "../../objectfields/objectfields";
import {GlobalComponents} from "../../globalcomponents/globalcomponents";
import {ObjectComponents} from "../../objectcomponents/objectcomponents";
import {SystemComponents} from "../../systemcomponents/systemcomponents";
import {DirectivesModule} from "../../directives/directives";

import /*embed*/ {FolderView} from "./components/folderview";
import /*embed*/ {FolderViewTree} from "./components/folderviewtree";
import /*embed*/ {FolderViewTreeItems} from "./components/folderviewtreeitems";
import {DragDropModule} from "@angular/cdk/drag-drop";




@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ObjectFields,
        GlobalComponents,
        ObjectComponents,
        SystemComponents,
        DirectivesModule,
        DragDropModule,

    ],
    declarations: [
        FolderView,
        FolderViewTree,
        FolderViewTreeItems,

    ],
    providers: [userpreferences]
})
export class ModuleFolders {

}
