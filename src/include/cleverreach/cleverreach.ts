/**
 * @module CleverReachModule
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

import {ProspectListsToCleverReachButton} from "./components/prospectliststocleverreachbutton";
import {ProspectListsToCleverReachModal} from "./components/prospectliststocleverreachmodal";
import {SendMailingButton} from "./components/sendmailingbutton";
import {SendMailingModal} from "./components/sendmailingmodal";

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
        ProspectListsToCleverReachButton,
        ProspectListsToCleverReachModal,
        SendMailingButton,
        SendMailingModal
    ]
})
export class CleverReachModule {
    public readonly version = "1.0";
    public readonly build_date = "/*build_date*/";

    constructor(
        private vms: VersionManagerService,
    ) {
        this.vms.registerModule(this);
    }
}
