/**
 * @module SpiceGanttModule
 */
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';

// spicecrm generic modules
import {SystemComponents} from "../../systemcomponents/systemcomponents";
import {GlobalComponents} from "../../globalcomponents/globalcomponents";
import {ObjectComponents} from "../../objectcomponents/objectcomponents";
import {ObjectFields} from "../../objectfields/objectfields";
import {DirectivesModule} from "../../directives/directives";

import {SpiceGantt} from "./components/spicegantt";
import {SpiceGanttItem} from "./components/spiceganttitem";
import {SpiceGanttMilestone} from "./components/spiceganttmilestone";

import {SpiceGanttLeft} from "./components/spicegannttleft";
import {SpiceGanttRight} from "./components/spiceganttright";
import {SpiceGanttLeftHeader} from "./components/spiceganttleftheader";
import {SpiceGanttLeftBody} from "./components/spiceganttleftbody";
import {SpiceGanttTreeTaskItem} from "./components/spicegantttreetaskitem";
import {SpiceGanttRightHeader} from "./components/spiceganttrightheader";
import {SpiceGanttRightBody} from "./components/spiceganttrightbody";
import {SpiceGanttTaskItem} from "./components/spicegantttaskitem";
import {SpiceGanttMomentLabel} from "./components/spiceganttmomentlabel";

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        SystemComponents,
        GlobalComponents,
        ObjectComponents,
        ObjectFields,
        DirectivesModule
    ],
    declarations: [
        SpiceGantt,
        SpiceGanttItem,
        SpiceGanttMilestone,

        SpiceGanttLeft,
        SpiceGanttRight,
        SpiceGanttLeftHeader,
        SpiceGanttLeftBody,
        SpiceGanttTreeTaskItem,
        SpiceGanttRightHeader,
        SpiceGanttRightBody,

        SpiceGanttMomentLabel,

        SpiceGanttTaskItem

    ],
    exports: [
        SpiceGantt,
        SpiceGanttItem,
        SpiceGanttMilestone
    ]
})
export class SpiceGanttModule {
}
