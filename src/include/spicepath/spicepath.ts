/**
 * @module ModuleSpicePath
 */
import {CommonModule} from "@angular/common";
import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {DragDropModule} from '@angular/cdk/drag-drop';

import {DirectivesModule} from "../../directives/directives";

import {ObjectFields} from "../../objectfields/objectfields";
import {GlobalComponents} from "../../globalcomponents/globalcomponents";
import {ObjectComponents} from "../../objectcomponents/objectcomponents";
import {SystemComponents} from "../../systemcomponents/systemcomponents";

import {SpiceKanbanStagePipe} from "./pipes/spicekanbanstagepipe";

import {SpicePathTrack} from './components/spicepathtrack';
import {SpicePathModel} from './components/spicepathmodel';
import {SpicePathWithCoaching} from './components/spicepathwithcoaching';
import {SpicePathRelatedListTiles} from './components/spicepathrelatedlisttiles';
import {SpicePathRelatedListTile} from './components/spicepathrelatedlisttile';
import {SpiceKanbanSumField} from "./components/spicekanbansumfield";
import {SpiceKanban} from "./components/spicekanban";
import {SpiceKanbanTile} from "./components/spicekanbantile";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ObjectFields,
        GlobalComponents,
        ObjectComponents,
        SystemComponents,
        DirectivesModule,
        DragDropModule
    ],
    declarations: [
        SpicePathTrack,
        SpicePathModel,
        SpicePathWithCoaching,
        SpicePathRelatedListTiles,
        SpicePathRelatedListTile,
        SpiceKanbanStagePipe,
        SpiceKanbanSumField,
        SpiceKanban,
        SpiceKanbanTile
    ]
})
export class ModuleSpicePath {
}
