/**
 * @module ModuleKnowledge
 */
import {CommonModule} from "@angular/common";
import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";

import {ObjectFields} from "../../objectfields/objectfields";
import {GlobalComponents} from "../../globalcomponents/globalcomponents";
import {ObjectComponents} from "../../objectcomponents/objectcomponents";
import {SystemComponents} from "../../systemcomponents/systemcomponents";

import {KnowledgeService} from "./services/knowledge.service";

import {KnowledgeBookSelector} from "./components/knowledgebookselector";
import {KnowledgeDocumentsSearch} from "./components/knowledgedocumentssearch";
import {KnowledgeDocumentRelatedList} from "./components/knowledgedocumentrelatedlist";
import {KnowledgeDocumentFavorites} from "./components/knowledgedocumentfavorites";
import {KnowledgeBrowserDetailsContainerRight} from "./components/knowledgebrowserdetailscontainerright";
import {KnowledgeBrowserDetailsContainerLeft} from "./components/knowledgebrowserdetailscontainerleft";
import {KnowledgeBrowserDetails} from "./components/knowledgebrowserdetails";
import {KnowledgeBrowser} from "./components/knowledgebrowser";
import {KnowledgeManagerDetails} from "./components/knowledgemanagerdetails";
import {KnowledgeManagerAddModal} from "./components/knowledgemanageraddmodal";
import {KnowledgeManager} from "./components/knowledgemanager";
import {KnowledgeContainer} from "./components/knowledgecontainer";
import {KnowledgeReleaseAllButton} from "./components/knowledgereleaseallbutton";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ObjectFields,
        GlobalComponents,
        ObjectComponents,
        SystemComponents
    ],
    declarations: [
        KnowledgeContainer,
        KnowledgeManagerAddModal,
        KnowledgeManager,
        KnowledgeManagerDetails,
        KnowledgeBrowser,
        KnowledgeBrowserDetails,
        KnowledgeBrowserDetailsContainerLeft,
        KnowledgeBrowserDetailsContainerRight,
        KnowledgeBookSelector,
        KnowledgeDocumentsSearch,
        KnowledgeDocumentRelatedList,
        KnowledgeDocumentFavorites,
        KnowledgeReleaseAllButton
    ],
    providers: [
        KnowledgeService
    ]
})
export class ModuleKnowledge {}
