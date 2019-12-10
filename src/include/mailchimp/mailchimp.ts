/**
 * @module MailChimpModule
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

// import {ProspectListsToMailChimpButton} from "./components/prospectliststomailchimphbutton";
// import {ProspectListsToMailChimpModal} from "./components/prospectliststomailchimphmodal";
// import {MailChimpCreateCampaignButton} from "./components/mailchimpcreatecampaignbutton";
// import {MailChimpCreateCampaignModal} from "./components/mailchimpcreatecampaignmodal";
import {MailChimpGetReportButton} from "./components/mailchimpgetreportbutton";


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
        // ProspectListsToMailChimpButton,
        // ProspectListsToMailChimpModal,
        // MailChimpCreateCampaignButton,
        // MailChimpCreateCampaignModal,
        MailChimpGetReportButton
    ]
})
export class MailChimpModule {
    public readonly version = "1.0";
    public readonly build_date = "/*build_date*/";

    constructor(
        private vms: VersionManagerService,
    ) {
        this.vms.registerModule(this);
    }
}
