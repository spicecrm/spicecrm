/**
 * @module ModuleNewsletters
 */
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule}   from "@angular/forms";

import {ObjectFields}      from '../../objectfields/objectfields';
import {GlobalComponents}      from '../../globalcomponents/globalcomponents';
import {ObjectComponents}      from '../../objectcomponents/objectcomponents';
import {SystemComponents}      from '../../systemcomponents/systemcomponents';
import {DirectivesModule} from "../../directives/directives";
import {NewsletterIssueCreateNewButton} from "./components/newsletterissuecreatenewbutton";
import {NewsletterIssueSendMailButton} from "./components/newsletterissuesendmailbutton";
import {NewsletterIssueSendTestEmailButton} from "./components/newsletterissuesendtestemailbutton";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ObjectFields,
        GlobalComponents,
        ObjectComponents,
        SystemComponents,
        DirectivesModule
    ],
    declarations: [
        NewsletterIssueCreateNewButton,
        NewsletterIssueSendMailButton,
        NewsletterIssueSendTestEmailButton
    ]
})
export class ModuleNewsletters {}
