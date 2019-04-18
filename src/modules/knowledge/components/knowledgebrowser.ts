/**
 * @module ModuleKnowledge
 */
import {AfterViewInit, Component, OnDestroy, ViewChild, ViewContainerRef} from "@angular/core";
import {metadata} from "../../../services/metadata.service";
import {language} from "../../../services/language.service";
import {model} from "../../../services/model.service";
import {KnowledgeService} from "../services/knowledge.service";
import {Subscription} from "rxjs";
import {relatedmodels} from "../../../services/relatedmodels.service";

@Component({
    templateUrl: "./src/modules/knowledge/templates/knowledgebrowser.html",
    providers: [KnowledgeService, model, relatedmodels]
})
export class KnowledgeBrowser implements AfterViewInit, OnDestroy {

    public config: any = {clickable: true};
    public activeTab: string = "tree";
    private subscription: Subscription = new Subscription();

    @ViewChild("maincontainer", {read: ViewContainerRef}) private maincontainer: ViewContainerRef;
    @ViewChild("tabsheadercontainer", {read: ViewContainerRef}) private tabsHeaderContainer: ViewContainerRef;

    constructor(private language: language,
                private model: model,
                private metadata: metadata,
                private relatedmodels: relatedmodels,
                private knowledgeService: KnowledgeService) {
        this.model.module = "KnowledgeDocuments";
    }

    get selectedBook() {
        return this.knowledgeService.selectedBook;
    }

    get documents() {
        return this.knowledgeService.documents;
    }

    get selectedId() {
        return this.knowledgeService.selectedId;
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
        return this.relatedmodels.isloading;
    }

    public ngAfterViewInit() {
        this.knowledgeService.setActiveModule("KnowledgeBooks");
    }

    public ngOnDestroy() {
        this.relatedmodels.stopSubscriptions();
        this.subscription.unsubscribe();
    }

    private handleSelectedItemEvent(id) {
        this.knowledgeService.selectedId = id;
        this.knowledgeService.replaceState("/module/KnowledgeDocuments/" + id);
    }
}
