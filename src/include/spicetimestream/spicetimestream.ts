/**
 * @module ModuleSpiceTimeStream
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
import {SpiceTimestreamItem} from './components/spicetimestreamitem';
import {SpiceTimestreamHeader} from './components/spicetimestreamheader';
import {SpiceTimestreamLabel} from './components/spicetimestreamlabel';
import {SpiceTimestreamSelector} from './components/spicetimestreamselector';
import {SpiceTimestream} from './components/spicetimestream';
import {SpiceTimestreamEmbedded} from './components/spicetimestreamembedded';
import {SpiceTimestreamRelated} from './components/spicetimestreamrelated';

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
        SpiceTimestream,
        SpiceTimestreamEmbedded,
        SpiceTimestreamSelector,
        SpiceTimestreamItem,
        SpiceTimestreamHeader,
        SpiceTimestreamLabel,
        SpiceTimestreamRelated
    ]
})
export class ModuleSpiceTimeStream {}
