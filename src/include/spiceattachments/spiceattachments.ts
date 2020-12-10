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
import /*embed*/ {SpiceAttachmentsPanel} from "./components/spiceattachmentspanel";
import /*embed*/ {SpiceAttachmentsPanelHeader} from "./components/spiceattachmentspanelheader";
import /*embed*/ {SpiceAttachmentsList} from "./components/spiceattachmentslist";
import /*embed*/ {SpiceAttachmentsPopupList} from "./components/spiceattachmentspopuplist";
import /*embed*/ {SpiceAttachmentFile} from "./components/spiceattachmentfile";
import /*embed*/ {SpiceAttachmentAddImageModal} from "./components/spiceattachmentaddimagemodal";
import /*embed*/ {SpiceAttachmentsCount} from "./components/spiceattachmentscount";
import /*embed*/ {fieldSpiceAttachmentsCount} from "./fields/fieldspiceattachmentscount";
import /*embed*/ {SpiceAttachmentsEditModal} from "./components/spiceattachmentseditmodal";
import /*embed*/ {SpiceAttachmentStats} from "./components/spiceattachmentstats";
import /*embed*/ {fieldModelAttachment} from "./fields/fieldmodelattachment";

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
