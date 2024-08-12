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
import {OutputRevisionsPDFTabContainer} from "./components/outputrevisionspdftabcontainer";
import {OutputRevisionsPDFTabContainerEmail} from "./components/outputrevisionspdftabcontaineremail";
import {OutputRevisionsPDFTabContainerPreview} from "./components/outputrevisionspdftabcontainerpreview";
import {ObjectActionOutputPdfModal} from "./components/objectactionoutputpdfmodal";
import {ModuleSAPIDOCs} from "../sapidocs/modulesapidocs";
import {ObjectActionRelatedOutputPdfModal} from "./components/objectactionrelatedoutpudpdfmodal";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ObjectFields,
        GlobalComponents,
        ObjectComponents,
        SystemComponents,
        DirectivesModule,
        ModuleSAPIDOCs
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
        ObjectActionMarkSentBeanButton,
        OutputRevisionsPDFTabContainer,
        OutputRevisionsPDFTabContainerEmail,
        OutputRevisionsPDFTabContainerPreview,
        ObjectActionOutputPdfModal,
        ObjectActionRelatedOutputPdfModal
    ],
    exports: [
        ObjectActionOutputBeanModalEmailContent
    ]
})
export class ModuleOutputTemplates {}
