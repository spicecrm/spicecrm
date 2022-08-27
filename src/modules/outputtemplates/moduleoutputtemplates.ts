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

import {outputModalService} from "./services/outputmodal.service";

import {OutputTemplatesEditor} from "./components/outputtemplateseditor";
import {OutputTemplatesPreview} from "./components/outputtemplatespreview";
import {OutputTemplatesPreviewSelector} from "./components/outputtemplatespreviewselector";
import {ObjectActionOutputBeanButton} from "./components/objectactionoutputbeanbutton";
import {ObjectActionLiveCompileBeanButton} from "./components/objectactionlivecompilebeanbutton";
import {ObjectActionOutputBeanModalEmailContent} from "./components/objectactionoutputbeanmodalemailcontent";
import {ObjectActionOutputBeanModal} from "./components/objectactionoutputbeanmodal";
import {fieldOutputTemplates} from "./fields/fieldoutputtemplates";
import {OutputTemplatesVariableHelper} from './components/outputtemplatesvariablehelper';
import {ObjectActionMarkSentBeanButton} from "./components/objectactionmarksentbeanbutton";

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
        OutputTemplatesEditor,
        OutputTemplatesPreview,
        OutputTemplatesPreviewSelector,
        ObjectActionOutputBeanButton,
        ObjectActionOutputBeanModalEmailContent,
        ObjectActionOutputBeanModal,
        fieldOutputTemplates,
        OutputTemplatesVariableHelper,
        ObjectActionLiveCompileBeanButton,
        ObjectActionMarkSentBeanButton
    ],
    exports: [
        ObjectActionOutputBeanModalEmailContent
    ]
})
export class ModuleOutputTemplates {}
