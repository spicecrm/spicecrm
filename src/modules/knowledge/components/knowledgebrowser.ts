/**
 * @module ModuleKnowledge
 */
import {AfterViewInit, Component, OnDestroy, ViewChild, ViewContainerRef} from "@angular/core";
import {metadata} from "../../../services/metadata.service";
import {language} from "../../../services/language.service";
import {model} from "../../../services/model.service";
import {KnowledgeService} from "../services/knowledge.service";
import {Subscription} from "rxjs";
import {navigationtab} from "../../../services/navigationtab.service";

@Component({
    selector: 'knowledge-browser',
    templateUrl: "../templates/knowledgebrowser.html",
    providers: [KnowledgeService, model]
})
export class KnowledgeBrowser implements AfterViewInit, OnDestroy {

    public activeTab: string = "tree";
    public subscription: Subscription = new Subscription();

    @ViewChild("maincontainer", {read: ViewContainerRef, static: true}) public maincontainer: ViewContainerRef;
    @ViewChild("tabsheadercontainer", {read: ViewContainerRef, static: true}) public tabsHeaderContainer: ViewContainerRef;

    constructor(public language: language,
                public model: model,
                public metadata: metadata,
                public navigationTab: navigationtab,
                public knowledgeService: KnowledgeService) {
        this.model.module = "KnowledgeDocuments";
        this.loadReleasedFilter();
    }

    get selectedBook() {
        return this.knowledgeService.selectedBook;
    }

    get documents() {
        return this.knowledgeService.documents;
    }

    set selectedDoc(id) {
        this.knowledgeService.selectedDoc = id;
        this.knowledgeService.replaceState("/module/KnowledgeDocuments/" + id);    }

    get selectedDoc() {
        return this.knowledgeService.selectedDoc;
    }

    get treeContainerStyle() {
        if (this.tabsHeaderContainer) {
            let rect = this.tabsHeaderContainer.element.nativeElement.getBoundingClientRect();
            return {height: `calc(100vh - ${rect.bottom}px)`};
        } else {
            return {};
        }
    }

    get isLoading() {
        return this.knowledgeService.isDocumentLoading;
    }

    public loadReleasedFilter() {
        let conf = this.metadata.getComponentConfig("KnowledgeBrowser", this.model.module);
        this.knowledgeService.moduleFilter = conf.modulefilter || "";
    }

    public ngAfterViewInit() {
        this.knowledgeService.setActiveModule("KnowledgeBooks");
        if (this.navigationTab.activeRoute.path == 'KnowledgeBrowser') {
            this.navigationTab.setTabInfo({displayname: 'Knowledge Browser', displayicon: 'knowledge_base'});
        }
    }

    public ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
