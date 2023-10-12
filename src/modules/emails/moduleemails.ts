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

import {EmailToObjectEmailText} from "./components/emailtoobjectemailtext";
import {EmailToObjectModal} from "./components/emailtoobjectmodal";
import {EmailToObjectButton} from "./components/emailtoobjectbutton";
import {EmailPreviewModal} from "./components/emailpreviewmodal";
import {EmailMSGPreviewModal} from "./components/emailmsgpreviewmodal";
import {EmailsPopoverBody} from "./components/emailspopoverbody";
import {fieldEmailStatus} from "./components/fieldemailstatus";
import {EmailReplyButton} from "./components/emailreplybutton";
import {EmailReplyModal} from "./components/emailreplymodal";
import {EmailForwardButton} from "./components/emailforwardbutton";
import {EmailForwardModal} from "./components/emailforwardmodal";
import {EmailSendButton} from "./components/emailsendbutton";
import {EmailSchedulesButton} from "./components/emailschedulesbutton";
import {EmailSchedulesCancelButton} from "./components/emailschedulescancelbutton";
import {EmailSchedulesModal} from "./components/emailschedulesmodal";
import {EmailSchedulesRelatedButton} from "./components/emailschedulesrelatedbutton";
import {EmailSchedulesRelatedModal} from "./components/emailschedulesrelatedmodal";
import {EmailSchedulesView} from "./components/emailschedulesview";
import {EmailSchedulesBeans} from "./components/emailschedulesbeans";
import {EmailActionSetReadButton} from "./components/emailactionsetreadbutton";
import {EmailTemplatesEditor} from "./components/emailtemplateseditor";
import {EmailTemplatesPreview} from "./components/emailtemplatespreview";
import {fieldEmailSubject} from "./fields/fieldemailsubject";
import {fieldEmailActivityOpenness} from "./fields/fieldemailactivityopenness";
import {EmailParentAddressesModal} from "./components/emailparentaddressesmodal";
import {EmailToLeadModal} from "./components/emailtoleadmodal";
import {EmailToLeadEmailText} from "./components/emailtoleademailtext";
import {EmailToLeadButton} from "./components/emailtoleadbutton";
import {EmailCloneAttachmentsButton} from "./components/emailcloneattachmentsbutton";
import {EmailCloneAttachmentsModal} from "./components/emailcloneattachmentsmodal";
import {ModuleSpiceAttachments} from "../../include/spiceattachments/spiceattachments";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ObjectFields,
        GlobalComponents,
        ObjectComponents,
        SystemComponents,
        DirectivesModule,
        ModuleSpiceAttachments,
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
        EmailToLeadButton,
        EmailCloneAttachmentsButton,
        EmailCloneAttachmentsModal
    ]
})
export class ModuleEmails {}
