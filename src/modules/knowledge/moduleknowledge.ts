/**
 * @module ModuleKnowledge
 */
import {CommonModule} from "@angular/common";
import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";

import {VersionManagerService} from "../../services/versionmanager.service";

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
import /*embed*/ {KnowledgeManager} from "./components/knowledgemanager";

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
        KnowledgeManager,
        KnowledgeManagerDetails,
        KnowledgeBrowser,
        KnowledgeBrowserDetails,
        KnowledgeBrowserDetailsContainerLeft,
        KnowledgeBrowserDetailsContainerRight,
        KnowledgeBookSelector,
        KnowledgeDocumentsSearch,
        KnowledgeDocumentRelatedList,
        KnowledgeDocumentFavorites
    ],
    providers: [
        KnowledgeService
    ]
})
export class ModuleKnowledge {
    public readonly version = "1.0";
    public readonly build_date = "/*build_date*/";

    constructor(private vms: VersionManagerService,) {
        this.vms.registerModule(this);
    }
}
