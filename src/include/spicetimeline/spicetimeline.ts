/**
 * @module ModuleSpiceTimeline
 */
import {CommonModule} from "@angular/common";
import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";

import {DirectivesModule} from "../../directives/directives";

import {ObjectFields} from "../../objectfields/objectfields";
import {GlobalComponents} from "../../globalcomponents/globalcomponents";
import {ObjectComponents} from "../../objectcomponents/objectcomponents";
import {SystemComponents} from "../../systemcomponents/systemcomponents";

// import interfaces
import {EventI, RecordI} from './interfaces/spicetimeline.interfaces';

import {SpiceTimeline} from './components/spicetimeline';
import {SpiceTimelineEvent} from './components/spicetimelineevent';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ObjectFields,
        GlobalComponents,
        ObjectComponents,
        SystemComponents,
        DirectivesModule
    ],
    declarations: [
        SpiceTimeline,
        SpiceTimelineEvent
    ],
    exports: [
        SpiceTimeline,
    ]
})
export class ModuleSpiceTimeline {}
