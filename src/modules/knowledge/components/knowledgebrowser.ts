/**
 * @module ModuleKnowledge
 */
import {AfterViewInit, Component, OnDestroy, ViewChild, ViewContainerRef} from "@angular/core";
import {metadata} from "../../../services/metadata.service";
import {language} from "../../../services/language.service";
import {model} from "../../../services/model.service";
import {navigation} from "../../../services/navigation.service";
import {KnowledgeService} from "../services/knowledge.service";
import {ActivatedRoute, Router} from '@angular/router';
import {Location} from '@angular/common';
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
                private navigation: navigation,
                private router: Router,
                private location: Location,
                private relatedmodels: relatedmodels,
                private activatedRoute: ActivatedRoute,
                private knowledgeService: KnowledgeService) {
        this.model.module = "KnowledgeDocuments";
        this.prepareRelatedModel();
        this.routerSubscriber();
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
        return this.knowledgeService.isLoading;
    }

    public ngAfterViewInit() {
        this.navigation.setActiveModule("KnowledgeBooks");
    }

    public ngOnDestroy() {
        this.relatedmodels.stopSubscriptions();
        this.subscription.unsubscribe();
    }

    private prepareRelatedModel() {
        this.relatedmodels.module = "KnowledgeBooks";
        this.relatedmodels.relatedModule = "KnowledgeDocuments";
        this.relatedmodels.sort.sortfield = "name";
        this.relatedmodels.sort.sortdirection = "ASC";
        this.relatedmodels.loaditems = -1;
    }

    private routerSubscriber() {
        this.subscription = this.activatedRoute.params.subscribe(params => {
            if (!params.id) {
                return;
            }
            this.model.id = params.id;
            this.knowledgeService.favoriteEnable(this.model.module, this.model.id);
            this.knowledgeService.selectedId = params.id;
            this.model.getData(true, 'detailview').subscribe(data => {
                this.navigation.setActiveModule("KnowledgeBooks", data.knowledgebook_id, data.knowledgebook_name);
                if (!this.knowledgeService.selectedBook) {
                    this.knowledgeService.selectedBook = {id: data.knowledgebook_id, name: data.knowledgebook_name};
                    this.knowledgeService.getDocuments(data.knowledgebook_id);
                }
            });
        });
    }

    private handleSelectedItemEvent(id) {
        this.knowledgeService.selectedId = id;
        this.location.replaceState("/module/KnowledgeDocuments/" + id);
    }
}
