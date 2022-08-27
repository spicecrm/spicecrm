/**
 * @module ModuleSpiceNotes
 */
import {CommonModule} from "@angular/common";
import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";

import {DirectivesModule} from "../../directives/directives";

import {ObjectFields} from "../../objectfields/objectfields";
import {GlobalComponents} from "../../globalcomponents/globalcomponents";
import {ObjectComponents} from "../../objectcomponents/objectcomponents";
import {SystemComponents} from "../../systemcomponents/systemcomponents";
import {SpiceAttachmentsPanel} from "./components/spiceattachmentspanel";
import {SpiceAttachmentsPanelHeader} from "./components/spiceattachmentspanelheader";
import {SpiceAttachmentsList} from "./components/spiceattachmentslist";
import {SpiceAttachmentsPopupList} from "./components/spiceattachmentspopuplist";
import {SpiceAttachmentFile} from "./components/spiceattachmentfile";
import {SpiceAttachmentAddImageModal} from "./components/spiceattachmentaddimagemodal";
import {SpiceAttachmentsCount} from "./components/spiceattachmentscount";
import {fieldSpiceAttachmentsCount} from "./fields/fieldspiceattachmentscount";
import {SpiceAttachmentsEditModal} from "./components/spiceattachmentseditmodal";
import {SpiceAttachmentStats} from "./components/spiceattachmentstats";
import {fieldModelAttachment} from "./fields/fieldmodelattachment";

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
        SpiceAttachmentsPanel,
        SpiceAttachmentsPanelHeader,
        SpiceAttachmentFile,
        SpiceAttachmentAddImageModal,
        SpiceAttachmentsList,
        SpiceAttachmentsPopupList,
        SpiceAttachmentsCount,
        fieldSpiceAttachmentsCount,
        SpiceAttachmentsEditModal,
        SpiceAttachmentStats,
        fieldModelAttachment
    ]
})
export class ModuleSpiceAttachments {

}
