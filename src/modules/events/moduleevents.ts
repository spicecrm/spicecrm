/**
 * @module ModuleEvents
 */
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule}   from "@angular/forms";

import {ObjectFields}      from '../../objectfields/objectfields';
import {GlobalComponents}      from '../../globalcomponents/globalcomponents';
import {ObjectComponents}      from '../../objectcomponents/objectcomponents';
import {SystemComponents}      from '../../systemcomponents/systemcomponents';
import {DirectivesModule} from "../../directives/directives";

import {EventRegistrationButton} from "./components/eventregistrationbutton";
import {EventRegistrationModal} from "./components/eventregistrationmodal";
import {EventRegistrationModalList} from "./components/eventregistrationmodallist";
import {EventRegistrationModalType} from "./components/eventregistrationmodaltype";
import {EventWithCampaignActivateButton} from "./components/eventwithcampaignactivatebutton";


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
        EventRegistrationButton,
        EventRegistrationModal,
        EventRegistrationModalList,
        EventRegistrationModalType,
        EventWithCampaignActivateButton
    ]
})
export class ModuleEvents {}
