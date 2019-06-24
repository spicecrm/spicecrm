/**
 * @module ModuleMailboxes
 */
import {CommonModule} from "@angular/common";
import {
    NgModule
} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {VersionManagerService} from "../../services/versionmanager.service";

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
import {MailboxManagerTextMessage} from "./components/mailboxmanagertextmessage";

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
    readonly version = "1.0";
    readonly build_date = "/*build_date*/";

    constructor(private vms: VersionManagerService) {
        this.vms.registerModule(this);
    }
}
