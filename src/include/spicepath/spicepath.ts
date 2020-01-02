/**
 * @module ModuleSpicePath
 */
import {CommonModule} from "@angular/common";
import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";

import {VersionManagerService} from "../../services/versionmanager.service";
import {DirectivesModule} from "../../directives/directives";

import {ObjectFields} from "../../objectfields/objectfields";
import {GlobalComponents} from "../../globalcomponents/globalcomponents";
import {ObjectComponents} from "../../objectcomponents/objectcomponents";
import {SystemComponents} from "../../systemcomponents/systemcomponents";

import /*embed*/ {SpicePathTrack} from './components/spicepathtrack';
import /*embed*/ {SpicePathModel} from './components/spicepathmodel';
import /*embed*/ {SpicePathWithCoaching} from './components/spicepathwithcoaching';
import /*embed*/ {SpicePathRelatedListTiles} from './components/spicepathrelatedlisttiles';
import /*embed*/ {SpicePathRelatedListTile} from './components/spicepathrelatedlisttile';

import /*embed*/ {SpiceKanbanStagePipe} from "./components/spicekanbanstagepipe";
import /*embed*/ {SpiceKanbanSumField} from "./components/spicekanbansumfield";
import /*embed*/ {SpiceKanban} from "./components/spicekanban";
import /*embed*/ {SpiceKanbanTile} from "./components/spicekanbantile";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ObjectFields,
        GlobalComponents,
        ObjectComponents,
        SystemComponents,
        DirectivesModule,
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
    public readonly version = "1.0";
    public readonly build_date = "/*build_date*/";

    constructor(
        private vms: VersionManagerService,
    ) {
        this.vms.registerModule(this);
    }
}