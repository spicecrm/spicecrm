/***** PROCESSFLOW-SPICE-HEADER-SPACEHOLDER *****/

/**
 * @module LiveChat
 */
import {CommonModule} from "@angular/common";
import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";

import {DirectivesModule} from "../../directives/directives";

import {ObjectFields} from "../../objectfields/objectfields";
import {GlobalComponents} from "../../globalcomponents/globalcomponents";
import {ObjectComponents} from "../../objectcomponents/objectcomponents";
import {SystemComponents} from "../../systemcomponents/systemcomponents";

import {ActivityTimelineTextMessages} from "./components/activitytimelinetextmessages";
import {GlobalDockedComposerChat} from "./components/globaldockedcomposerchat";
import {LiveChatContainer} from "./components/livechatcontainer";
import {ActivityTimelineItemContainer} from "../../modules/activities/components/activitytimelineitemcontainer";
import {ActivityTimelineStencil} from "../../modules/activities/components/activitytimelinestencil";

/**
 * provides components for the
 */
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
        ActivityTimelineTextMessages,
        GlobalDockedComposerChat,
        LiveChatContainer
    ],
    exports: [
        ActivityTimelineTextMessages,
        GlobalDockedComposerChat,
        LiveChatContainer
    ]
})
export class ModuleLiveChat {
}
