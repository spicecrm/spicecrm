/**
 * @module ModuleSpicePath
 */
import {CommonModule} from "@angular/common";
import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";

import {DirectivesModule} from "../../directives/directives";

import {GlobalComponents} from "../../globalcomponents/globalcomponents";
import {ObjectComponents} from "../../objectcomponents/objectcomponents";
import {SystemComponents} from "../../systemcomponents/systemcomponents";
import {SpiceAccountDeterminationManager} from "./components/spiceaccountdeterminationmanager";
import {ExcludeDeletedPipe} from "./pipes/excludedeletedpipe";



@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        GlobalComponents,
        ObjectComponents,
        SystemComponents,
        DirectivesModule,
    ],
    declarations: [
        SpiceAccountDeterminationManager,
        ExcludeDeletedPipe
    ]
})
export class ModuleSpiceAccountDetermination {
}
