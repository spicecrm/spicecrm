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

import {scrum} from "./services/scrum.service";

import {ScrumTreeAddItem} from "./components/scrumtreeadditem";
import {ScrumTreeTheme} from "./components/scrumtreetheme";
import {ScrumTreeDetail} from "./components/scrumtreedetail";
import {ScrumTreeUserStory} from "./components/scrumtreeuserstory";
import {ScrumTreeEpic} from "./components/scrumtreeepic";
import {ScrumMain} from "./components/scrummain";
import {ScrumTree} from "./components/scrumtree";

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
}
