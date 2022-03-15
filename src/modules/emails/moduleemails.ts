/**
 * @module ModuleEmails
 */
import {CommonModule} from "@angular/common";
import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";

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
import /*embed*/ {EmailForwardButton} from "./components/emailforwardbutton";
import /*embed*/ {EmailForwardModal} from "./components/emailforwardmodal";
import /*embed*/ {EmailSendButton} from "./components/emailsendbutton";
import /*embed*/ {EmailSchedulesButton} from "./components/emailschedulesbutton";
import /*embed*/ {EmailSchedulesCancelButton} from "./components/emailschedulescancelbutton";
import /*embed*/ {EmailSchedulesModal} from "./components/emailschedulesmodal";
import /*embed*/ {EmailSchedulesRelatedButton} from "./components/emailschedulesrelatedbutton";
import /*embed*/ {EmailSchedulesRelatedModal} from "./components/emailschedulesrelatedmodal";
import /*embed*/ {EmailSchedulesView} from "./components/emailschedulesview";
import /*embed*/ {EmailSchedulesBeans} from "./components/emailschedulesbeans";
import /*embed*/ {EmailActionSetReadButton} from "./components/emailactionsetreadbutton";
import /*embed*/ {EmailTemplatesEditor} from "./components/emailtemplateseditor";
import /*embed*/ {EmailTemplatesPreview} from "./components/emailtemplatespreview";
import /*embed*/ {fieldEmailSubject} from "./fields/fieldemailsubject";
import /*embed*/ {fieldEmailActivityOpenness} from "./fields/fieldemailactivityopenness";
import /*embed*/ {EmailParentAddressesModal} from "./components/emailparentaddressesmodal";
import /*embed*/ {EmailToLeadModal} from "./components/emailtoleadmodal";
import /*embed*/ {EmailToLeadEmailText} from "./components/emailtoleademailtext";
import /*embed*/ {EmailToLeadButton} from "./components/emailtoleadbutton";

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
        EmailSendButton,
        EmailForwardButton,
        EmailForwardModal,
        EmailSchedulesButton,
        EmailSchedulesModal,
        EmailSchedulesRelatedButton,
        EmailSchedulesCancelButton,
        EmailSchedulesRelatedModal,
        EmailSchedulesView,
        EmailSchedulesBeans,
        EmailActionSetReadButton,
        EmailTemplatesEditor,
        EmailTemplatesPreview,
        EmailParentAddressesModal,
        fieldEmailSubject,
        fieldEmailActivityOpenness,
        EmailToLeadModal,
        EmailToLeadEmailText,
        EmailToLeadButton
    ]
})
export class ModuleEmails {}
