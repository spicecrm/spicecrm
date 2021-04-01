/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

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
import /*embed*/ {EmailSchedulesModal} from "./components/emailschedulesmodal";
import /*embed*/ {EmailSchedulesRelatedButton} from "./components/emailschedulesrelatedbutton";
import /*embed*/ {EmailSchedulesRelatedModal} from "./components/emailschedulesrelatedmodal";
import /*embed*/ {EmailSchedulesView} from "./components/emailschedulesview";
import /*embed*/ {EmailActionSetReadButton} from "./components/emailactionsetreadbutton";
import /*embed*/ {EmailTemplatesEditor} from "./components/emailtemplateseditor";
import /*embed*/ {EmailTemplatesPreview} from "./components/emailtemplatespreview";
import /*embed*/ {fieldEmailSubject} from "./fields/fieldemailsubject";

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
        EmailSchedulesRelatedModal,
        EmailSchedulesView,
        EmailActionSetReadButton,
        EmailTemplatesEditor,
        EmailTemplatesPreview,
        fieldEmailSubject
    ]
})
export class ModuleEmails {}
