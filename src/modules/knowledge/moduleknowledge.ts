import {CommonModule} from "@angular/common";
import {
    AfterViewInit,
    ComponentFactoryResolver,
    Component,
    ElementRef,
    NgModule,
    AfterViewChecked,
    Renderer,
    Renderer2,
    ViewChild,
    ViewContainerRef,
    Injectable,
    Input,
    Output,
    EventEmitter,
    SimpleChanges,
    OnInit,
    OnDestroy,
    OnChanges,
    ChangeDetectorRef
} from "@angular/core";
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {FormsModule} from "@angular/forms";
import {RouterModule, Routes, Router, ActivatedRoute} from "@angular/router";

import {Subject, Observable} from "rxjs";


import {loginService, loginCheck} from "../../services/login.service";
import {metadata, aclCheck} from "../../services/metadata.service";
import {model} from "../../services/model.service";
import {modal} from "../../services/modal.service";
import {modellist} from "../../services/modellist.service";
import {relatedmodels} from "../../services/relatedmodels.service";
import {modelutilities} from "../../services/modelutilities.service";
import {helper} from "../../services/helper.service";
import {language} from "../../services/language.service";
import {broadcast} from "../../services/broadcast.service";
import {navigation} from "../../services/navigation.service";
import {backend} from "../../services/backend.service";
import {session} from "../../services/session.service";
import {footer} from "../../services/footer.service";
import {assistant} from "../../services/assistant.service";
import {view} from "../../services/view.service";
import {popup} from "../../services/popup.service";
import {toast} from "../../services/toast.service";
import {fts} from "../../services/fts.service";
import {configurationService} from "../../services/configuration.service";
import {VersionManagerService} from "../../services/versionmanager.service";
import /*embed*/ {KnowledgeService} from "./services/knowledge.service";


import {ObjectFields} from "../../objectfields/objectfields";
import {GlobalComponents} from "../../globalcomponents/globalcomponents";
import {ObjectComponents} from "../../objectcomponents/objectcomponents";
import {SystemComponents} from "../../systemcomponents/systemcomponents";
import {AddComponentsModule} from "../../addcomponents/addcomponents.module";
import {GlobalUtilityComponents} from "../../globalutilitycomponents/globalutilitycomponents";

import /*embed*/ {KnowledgeManager} from "./components/knowledgemanager";
import /*embed*/ {KnowledgeManagerDetails} from "./components/knowledgemanagerdetails";
import /*embed*/ {KnowledgeBrowser} from "./components/knowledgebrowser";
import /*embed*/ {KnowledgeBrowserDetails} from "./components/knowledgebrowserdetails";
import /*embed*/ {KnowledgeBrowserDetailsContainerLeft} from "./components/knowledgebrowserdetailscontainerleft";
import /*embed*/ {KnowledgeBrowserDetailsContainerRight} from "./components/knowledgebrowserdetailscontainerright";
import /*embed*/ {KnowledgeBookSelector} from "./components/knowledgebookselector";
import /*embed*/ {KnowledgeDocumentsSearch} from "./components/knowledgedocumentssearch";
import /*embed*/ {KnowledgeDocumentRelatedList} from "./components/knowledgedocumentrelatedlist";
import /*embed*/ {KnowledgeDocumentFavorites} from "./components/knowledgedocumentfavorites";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ObjectFields,
        GlobalComponents,
        ObjectComponents,
        SystemComponents,
        GlobalUtilityComponents,
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