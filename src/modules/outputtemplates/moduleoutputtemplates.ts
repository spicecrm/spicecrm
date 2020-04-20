/**
 * @module ModuleOutputTemplates
 */
import {CommonModule} from "@angular/common";
import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";

import {DirectivesModule} from "../../directives/directives";
import {ObjectFields} from "../../objectfields/objectfields";
import {GlobalComponents} from "../../globalcomponents/globalcomponents";
import {ObjectComponents} from "../../objectcomponents/objectcomponents";
import {SystemComponents} from "../../systemcomponents/systemcomponents";

import /*embed*/ {OutputTemplatesEditor} from "./components/outputtemplateseditor";
import /*embed*/ {OutputTemplatesPreview} from "./components/outputtemplatespreview";
import /*embed*/ {ObjectActionOutputBeanButton} from "./components/objectactionoutputbeanbutton";
import /*embed*/ {ObjectActionOutputBeanModal} from "./components/objectactionoutputbeanmodal";
import /*embed*/ {fieldOutputTemplates} from "./fields/fieldoutputtemplates";

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
        OutputTemplatesEditor,
        OutputTemplatesPreview,
        ObjectActionOutputBeanButton,
        ObjectActionOutputBeanModal,
        fieldOutputTemplates
    ]
})
export class ModuleOutputTemplates {}
