/**
 * @module ModuleFolders
 */
import {CommonModule} from "@angular/common";
import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";

import {ObjectFields} from "../../objectfields/objectfields";
import {GlobalComponents} from "../../globalcomponents/globalcomponents";
import {ObjectComponents} from "../../objectcomponents/objectcomponents";
import {SystemComponents} from "../../systemcomponents/systemcomponents";
import {DirectivesModule} from "../../directives/directives";
import {DragDropModule} from "@angular/cdk/drag-drop";

import /*embed*/ {FolderViewTree} from "./components/folderviewtree";
import /*embed*/ {FolderViewTreeItems} from "./components/folderviewtreeitems";
import /*embed*/ {FolderObjectListView} from './components/folderobjectlistview';

@NgModule( {
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
        FolderViewTree,
        FolderViewTreeItems,
        FolderObjectListView
    ],
    exports: [
        FolderViewTree
    ]
})
export class ModuleFolders { }
