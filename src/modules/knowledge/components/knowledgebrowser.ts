/**
 * @module ModuleKnowledge
 */
import {AfterViewInit, Component, OnDestroy, ViewChild, ViewContainerRef} from "@angular/core";
import {metadata} from "../../../services/metadata.service";
import {language} from "../../../services/language.service";
import {model} from "../../../services/model.service";
import {KnowledgeService} from "../services/knowledge.service";
import {Subscription} from "rxjs";

@Component({
    selector: 'knowledge-browser',
    templateUrl: "./src/modules/knowledge/templates/knowledgebrowser.html",
    providers: [KnowledgeService, model]
})
export class KnowledgeBrowser implements AfterViewInit, OnDestroy {

    public activeTab: string = "tree";
    private subscription: Subscription = new Subscription();

    @ViewChild("maincontainer", {read: ViewContainerRef, static: true}) private maincontainer: ViewContainerRef;
    @ViewChild("tabsheadercontainer", {read: ViewContainerRef, static: true}) private tabsHeaderContainer: ViewContainerRef;

    constructor(private language: language,
                private model: model,
                private metadata: metadata,
                private knowledgeService: KnowledgeService) {
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

    private loadReleasedFilter() {
        let conf = this.metadata.getComponentConfig("KnowledgeBrowser", this.model.module);
        this.knowledgeService.moduleFilter = conf.modulefilter || "";
    }

    public ngAfterViewInit() {
        this.knowledgeService.setActiveModule("KnowledgeBooks");
        this.knowledgeService.setTabInfo({displayname: 'Knowledge Browser', displayicon: 'knowledge_base'});
    }

    public ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
