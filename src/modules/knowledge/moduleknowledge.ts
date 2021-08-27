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
import {AddComponentsModule} from "../../addcomponents/addcomponents.module";

import /*embed*/ {KnowledgeService} from "./services/knowledge.service";

import /*embed*/ {KnowledgeBookSelector} from "./components/knowledgebookselector";
import /*embed*/ {KnowledgeDocumentsSearch} from "./components/knowledgedocumentssearch";
import /*embed*/ {KnowledgeDocumentRelatedList} from "./components/knowledgedocumentrelatedlist";
import /*embed*/ {KnowledgeDocumentFavorites} from "./components/knowledgedocumentfavorites";
import /*embed*/ {KnowledgeBrowserDetailsContainerRight} from "./components/knowledgebrowserdetailscontainerright";
import /*embed*/ {KnowledgeBrowserDetailsContainerLeft} from "./components/knowledgebrowserdetailscontainerleft";
import /*embed*/ {KnowledgeBrowserDetails} from "./components/knowledgebrowserdetails";
import /*embed*/ {KnowledgeBrowser} from "./components/knowledgebrowser";
import /*embed*/ {KnowledgeManagerDetails} from "./components/knowledgemanagerdetails";
import /*embed*/ {KnowledgeManagerAddModal} from "./components/knowledgemanageraddmodal";
import /*embed*/ {KnowledgeManager} from "./components/knowledgemanager";
import /*embed*/ {KnowledgeContainer} from "./components/knowledgecontainer";
import /*embed*/ {KnowledgeReleaseAllButton} from "./components/knowledgereleaseallbutton";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ObjectFields,
        GlobalComponents,
        ObjectComponents,
        SystemComponents,
        AddComponentsModule
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
