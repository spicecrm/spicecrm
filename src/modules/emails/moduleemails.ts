/**
 * @module ModuleEmails
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

import /*embed*/ {EmailToObjectEmailText} from "./components/emailtoobjectemailtext";
import /*embed*/ {EmailToObjectModal} from "./components/emailtoobjectmodal";
import /*embed*/ {EmailToObjectButton} from "./components/emailtoobjectbutton";
import /*embed*/ {EmailPreviewModal} from "./components/emailpreviewmodal";
import /*embed*/ {EmailMSGPreviewModal} from "./components/emailmsgpreviewmodal";
import /*embed*/ {EmailsPopoverBody} from "./components/emailspopoverbody";
import /*embed*/ {fieldEmailStatus} from "./components/fieldemailstatus";
import /*embed*/ {EmailReplyButton} from "./components/emailreplybutton";
import /*embed*/ {EmailReplyModal} from "./components/emailreplymodal";
import /*embed*/ {EmailSchedulesButton} from "./components/emailschedulesbutton";
import /*embed*/ {EmailSchedulesModal} from "./components/emailschedulesmodal";
import /*embed*/ {EmailSchedulesRelatedButton} from "./components/emailschedulesrelatedbutton";
import /*embed*/ {EmailSchedulesRelatedModal} from "./components/emailschedulesrelatedmodal";
import /*embed*/ {EmailSchedulesView} from "./components/emailschedulesview";
import /*embed*/ {EmailActionSetReadButton} from "./components/emailactionsetreadbutton";

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
        EmailToObjectButton,
        EmailToObjectEmailText,
        EmailToObjectModal,
        EmailPreviewModal,
        EmailMSGPreviewModal,
        EmailsPopoverBody,
        fieldEmailStatus,
        EmailReplyButton,
        EmailReplyModal,
        EmailSchedulesButton,
        EmailSchedulesModal,
        EmailSchedulesRelatedButton,
        EmailSchedulesRelatedModal,
        EmailSchedulesView,
        EmailActionSetReadButton
    ]
})
export class ModuleEmails {
    public readonly version = "1.0";
    public readonly build_date = "/*build_date*/";

    constructor(
        private vms: VersionManagerService,
    ) {
        this.vms.registerModule(this);
    }
}
