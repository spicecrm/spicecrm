/**
 * @module ModuleScrum
 */
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {DragDropModule} from "@angular/cdk/drag-drop";

import {ObjectFields} from '../../objectfields/objectfields';
import {GlobalComponents} from '../../globalcomponents/globalcomponents';
import {ObjectComponents} from '../../objectcomponents/objectcomponents';
import {SystemComponents} from '../../systemcomponents/systemcomponents';
import {DirectivesModule} from "../../directives/directives";
import {VersionManagerService} from "../../services/versionmanager.service";

import /*embed*/ {scrum} from "./services/scrum.service";

import /*embed*/ {ScrumTreeAddItem} from "./components/scrumtreeadditem";
import /*embed*/ {ScrumTreeTheme} from "./components/scrumtreetheme";
import /*embed*/ {ScrumTreeDetail} from "./components/scrumtreedetail";
import /*embed*/ {ScrumTreeUserStory} from "./components/scrumtreeuserstory";
import /*embed*/ {ScrumTreeEpic} from "./components/scrumtreeepic";
import /*embed*/ {ScrumMain} from "./components/scrummain";
import /*embed*/ {ScrumTree} from "./components/scrumtree";

@NgModule({
    imports: [
        CommonModule,
        ObjectFields,
        GlobalComponents,
        ObjectComponents,
        SystemComponents,
        DirectivesModule,
        DragDropModule
    ],
    declarations: [
        ScrumMain,
        ScrumTree,
        ScrumTreeAddItem,
        ScrumTreeTheme,
        ScrumTreeEpic,
        ScrumTreeUserStory,
        ScrumTreeDetail
    ],
    providers: [scrum]
})
export class ModuleScrum {
    public readonly version = '1.0';
    public readonly build_date = '/*build_date*/';

    constructor(
        private vms: VersionManagerService,
    ) {
        vms.registerModule(this);
    }
}
