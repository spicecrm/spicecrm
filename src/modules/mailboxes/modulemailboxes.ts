/*
SpiceUI 2021.01.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

/**
 * @module ModuleMailboxes
 */
import {CommonModule} from "@angular/common";
import {
    NgModule
} from "@angular/core";
import {FormsModule} from "@angular/forms";

import {DirectivesModule} from "../../directives/directives";
import {GlobalComponents} from "../../globalcomponents/globalcomponents";
import {ObjectComponents} from "../../objectcomponents/objectcomponents";
import {ObjectFields} from "../../objectfields/objectfields";
import {SystemComponents} from "../../systemcomponents/systemcomponents";

import /*embed*/ {mailboxesEmails} from "./services/mailboxesemail.service";

import /*embed*/ {MailboxManager} from "./components/mailboxmanager";
import /*embed*/ {MailboxManagerHeader} from "./components/mailboxmanagerheader";
import /*embed*/ {MailboxManagerEmails} from "./components/mailboxmanageremails";
import /*embed*/ {MailboxManagerEmail} from "./components/mailboxmanageremail";
import /*embed*/ {MailboxmanagerEmailDetails} from "./components/mailboxmanageremaildetails";
import /*embed*/ {MailboxEmailToLeadButton} from "./components/mailboxemailtoleadbutton";
import /*embed*/ {MailboxEmailToLeadModal} from "./components/mailboxemailtoleadmodal";
import /*embed*/ {MailboxEmailToLeadEmailText} from "./components/mailboxemailtoleademailtext";
import /*embed*/ { MailboxesDashlet } from "./components/mailboxesdashlet";
import /*embed*/ {MailboxManagerTextMessages} from "./components/mailboxmanagertextmessages";
import /*embed*/  {MailboxManagerTextMessage} from "./components/mailboxmanagertextmessage";
import /*embed*/  {fieldMailboxes} from "./fields/fieldmailboxes";

@NgModule({
    declarations: [
        MailboxManager,
        MailboxManagerHeader,
        MailboxManagerEmails,
        MailboxManagerEmail,
        MailboxmanagerEmailDetails,
        MailboxManagerTextMessage,
        MailboxManagerTextMessages,
        MailboxEmailToLeadButton,
        MailboxEmailToLeadModal,
        MailboxEmailToLeadEmailText,
        MailboxesDashlet,
        fieldMailboxes
    ],
    imports: [
        CommonModule,
        FormsModule,
        ObjectFields,
        GlobalComponents,
        ObjectComponents,
        SystemComponents,
        DirectivesModule,
    ],
})
export class ModuleMailboxes {

}
