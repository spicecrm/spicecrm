/**
 * @module Sendgrid
 */
import {CommonModule} from "@angular/common";
import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";

import {ObjectFields} from "../../objectfields/objectfields";
import {DirectivesModule} from "../../directives/directives";
import {ObjectComponents} from "../../objectcomponents/objectcomponents";
import {SystemComponents} from "../../systemcomponents/systemcomponents";
import {SendgridTransferButton} from "./components/sendgridtransferbutton";
import {SendgridDeleteListButton} from "./components/sendgriddeletelistbutton";
import {SendgridSyncUnsubscribeButton} from "./components/sendgridsyncunsubscribebutton";
import {SendgridUnsubscribeDeleteButton} from "./components/sendgridunsubscribedeletebutton";
import {fieldUnsubscribeStatus} from "./fields/fieldunsubscribestatus";
import {
    SendgridDeleteContactFromUnsubscribeListButton
} from "./components/sendgriddeletecontactfromunsubscribelistbutton";


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
            SendgridTransferButton,
            SendgridDeleteListButton,
            SendgridSyncUnsubscribeButton,
            SendgridUnsubscribeDeleteButton,
            fieldUnsubscribeStatus,
            SendgridDeleteContactFromUnsubscribeListButton
        ]
    })
export class SendGridModule {
}
