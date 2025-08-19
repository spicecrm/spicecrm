/**
 * @module ModuleProjects
 */
import {CommonModule} from "@angular/common";
import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";

import {DirectivesModule} from "../../directives/directives";

import {ObjectFields} from "../../objectfields/objectfields";
import {ObjectComponents} from "../../objectcomponents/objectcomponents";
import {SystemComponents} from "../../systemcomponents/systemcomponents";

import {ProjectActivityTrackTimeModal} from "./components/projectactivitytracktimemodal";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ObjectFields,
        ObjectComponents,
        SystemComponents,
        DirectivesModule
    ],
    declarations: [
        ProjectActivityTrackTimeModal
    ], exports: [
        ProjectActivityTrackTimeModal
    ]
})
export class ModuleProjects {}
