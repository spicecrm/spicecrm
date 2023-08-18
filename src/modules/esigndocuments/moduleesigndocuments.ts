/**
 * @module ModuleAgreements
 */
import {CommonModule} from "@angular/common";
import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";

import {DirectivesModule} from "../../directives/directives";

import {ObjectFields} from "../../objectfields/objectfields";
import {GlobalComponents} from "../../globalcomponents/globalcomponents";
import {ObjectComponents} from "../../objectcomponents/objectcomponents";
import {SystemComponents} from "../../systemcomponents/systemcomponents";

import {ESignDocumentsActionButton} from "./components/esigndocumentsactionbutton";
import {ESignDocumentsModal} from "./components/esigndocumentsmodal";
import {ModuleOutputTemplates} from "../outputtemplates/moduleoutputtemplates";
import {ESignDocumentParticipantsModel} from "./components/esigndocumentparticipantsmodel";
import {ESignDocumentAtcionsFields} from "./fields/esigndocumentatcionsfields";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ObjectFields,
        GlobalComponents,
        ObjectComponents,
        SystemComponents,
        DirectivesModule,
        ModuleOutputTemplates,
    ],
    declarations: [
        ESignDocumentsActionButton,
        ESignDocumentsModal,
        ESignDocumentParticipantsModel,
        ESignDocumentAtcionsFields
    ],
})
export class ModuleESignDocuments {}
