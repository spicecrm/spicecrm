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

import {mailboxesEmails} from "./services/mailboxesemail.service";

import {MailboxManager} from "./components/mailboxmanager";
import {MailboxManagerHeader} from "./components/mailboxmanagerheader";
import {MailboxManagerEmails} from "./components/mailboxmanageremails";
import {MailboxManagerEmail} from "./components/mailboxmanageremail";
import {MailboxmanagerEmailDetails} from "./components/mailboxmanageremaildetails";
import {MailboxEmailToLeadButton} from "./components/mailboxemailtoleadbutton";
import {MailboxEmailToLeadModal} from "./components/mailboxemailtoleadmodal";
import {MailboxEmailToLeadEmailText} from "./components/mailboxemailtoleademailtext";
import { MailboxesDashlet } from "./components/mailboxesdashlet";
import {MailboxManagerTextMessages} from "./components/mailboxmanagertextmessages";
import {MailboxSetDefaultButton} from "./components/mailboxsetdefaultbutton";
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
        MailboxSetDefaultButton,
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
