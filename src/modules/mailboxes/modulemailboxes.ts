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
