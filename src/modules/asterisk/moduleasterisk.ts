/**
 * @module ModuleAsterisk
 */
import {CommonModule} from "@angular/common";
import {NgModule} from "@angular/core";
import {FormsModule}   from "@angular/forms";

import {userpreferences} from "../../services/userpreferences.service";
import {VersionManagerService} from "../../services/versionmanager.service";

import {ObjectFields} from "../../objectfields/objectfields";
import {GlobalComponents} from "../../globalcomponents/globalcomponents";
import {ObjectComponents} from "../../objectcomponents/objectcomponents";
import {SystemComponents} from "../../systemcomponents/systemcomponents";
import {DirectivesModule} from "../../directives/directives";

import /*embed*/ {AsteriskToolbarIndicator} from "./components/asterisktoolbarindicator";


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
        AsteriskToolbarIndicator
    ],
    providers: [userpreferences]
})
export class ModuleAsterisk {
    public version = "1.0";
    public build_date = "/*build_date*/";

    constructor(
        private vms: VersionManagerService,
    ) {
        this.vms.registerModule(this);
    }
}
