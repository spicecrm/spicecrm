import {Component, ViewChild, ViewContainerRef, OnDestroy} from "@angular/core";
import {metadata} from "../../../services/metadata.service";
import {language} from "../../../services/language.service";
import {model} from "../../../services/model.service";
import {navigation} from "../../../services/navigation.service";
import {favorite} from "../../../services/favorite.service";
import {IConfig} from "../../../systemcomponents/components/systemtree";
import {KnowledgeService} from "../services/knowledge.service";
import {ActivatedRoute, Router} from '@angular/router';
import {Location} from '@angular/common';

@Component({
    templateUrl: "./src/modules/knowledge/templates/knowledgebrowser.html",
    providers: [KnowledgeService, model]
})
export class KnowledgeBrowser implements OnDestroy {

    public config: IConfig = {clickable: true};
    public activeTab: string = "tree";
    private routeSubscribe: any = {};

    @ViewChild("maincontainer", {read: ViewContainerRef}) private maincontainer: ViewContainerRef;
    @ViewChild("tabsheadercontainer", {read: ViewContainerRef}) private tabsHeaderContainer: ViewContainerRef;

    constructor(private language: language,
                private model: model,
                private metadata: metadata,
                private navigation: navigation,
                private router: Router,
                private location: Location,
                private activatedRoute: ActivatedRoute,
                private knowledgeService: KnowledgeService) {
        this.model.module = "KnowledgeDocuments";
        this.routeSubscribe = this.activatedRoute.params.subscribe(params => {
            if (!params.id) {
                return;
            }
            this.model.id = params.id;
            this.knowledgeService.favoriteEnable(this.model.module, this.model.id);
            this.knowledgeService.selectedId = params.id;
            this.model.getData(true, 'detailview').subscribe(data => {
                this.navigation.setActiveModule(this.model.module, this.model.id, data.summary_text);
                if (!this.knowledgeService.selectedBook) {
                    this.knowledgeService.selectedBook = {id: data.knowledgebook_id, name: data.knowledgebook_name};
                    this.knowledgeService.getDocuments(data.knowledgebook_id);
                }
            });
        });
    }

    public ngOnDestroy() {
        this.routeSubscribe.unsubscribe();
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

    private handleSelectedItemEvent(id) {
        this.knowledgeService.selectedId = id;
        this.location.replaceState("/module/KnowledgeDocuments/" + id);
    }
}
