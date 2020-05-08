/**
 * @module CleverReachModule
 */
import {CommonModule} from "@angular/common";
import {NgModule} from "@angular/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

import {VersionManagerService} from "../../services/versionmanager.service";
import {DirectivesModule} from "../../directives/directives";

import {ObjectFields} from "../../objectfields/objectfields";
import {GlobalComponents} from "../../globalcomponents/globalcomponents";
import {ObjectComponents} from "../../objectcomponents/objectcomponents";
import {SystemComponents} from "../../systemcomponents/systemcomponents";

import /*embed*/ {ProspectListsToCleverReachButton} from "./components/prospectliststocleverreachbutton";
import /*embed*/ {ProspectListsToCleverReachModal} from "./components/prospectliststocleverreachmodal";
import /*embed*/ {CreateMailingButton} from "./components/createmailingbutton";
import /*embed*/ {CreateMailingModal} from "./components/createmailingmodal";

import /*embed*/ {GetStatsButton} from "./components/getstatsbutton";
import /*embed*/ {MailingStatsPanel} from "./components/mailingstatspanel";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ObjectFields,
        GlobalComponents,
        ObjectComponents,
        SystemComponents,
        DirectivesModule,
        ReactiveFormsModule,
    ],
    declarations: [
        ProspectListsToCleverReachButton,
        ProspectListsToCleverReachModal,
        CreateMailingButton,
        CreateMailingModal,
        GetStatsButton,
        MailingStatsPanel
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
