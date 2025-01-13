/**
 * @module Mailgun
 */
import {CommonModule} from "@angular/common";
import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";

import {ObjectFields} from "../../objectfields/objectfields";
import {DirectivesModule} from "../../directives/directives";
import {ObjectComponents} from "../../objectcomponents/objectcomponents";
import {SystemComponents} from "../../systemcomponents/systemcomponents";
import {MailgunValidateAllButton} from "./components/mailgunvalidateallbutton";
import {MailgunValidateEmailButton} from "./components/mailgunvalidateemailbutton";

@NgModule(
    {
        imports: [
            CommonModule,
            FormsModule,
            SystemComponents,
            ObjectFields,
            ObjectComponents,
            DirectivesModule
        ],
        declarations: [
            MailgunValidateAllButton,
            MailgunValidateEmailButton

        ]
    })
export class MailgunModule {
}
