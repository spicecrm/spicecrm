/**
 * @module ModuleSpiceTimeline
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

// import interfaces
// import /*embed*/ {} from './interfaces/spicetimeline.interfaces';

import /*embed*/ {SpiceTimeline} from './components/spicetimeline';
import /*embed*/ {SpiceTimelineEvent} from './components/spicetimelineevent';

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
export class ModuleSpiceTimeline {
    public readonly version = "1.0";
    public readonly build_date = "/*build_date*/";

    constructor(
        private vms: VersionManagerService,
    ) {
        this.vms.registerModule(this);
    }
}
