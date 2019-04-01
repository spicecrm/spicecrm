/**
 * @module ModuleKnowledge
 */
import {AfterViewInit, Component, OnDestroy, ViewChild, ViewContainerRef} from "@angular/core";
import {metadata} from "../../../services/metadata.service";
import {language} from "../../../services/language.service";
import {model} from "../../../services/model.service";
import {backend} from "../../../services/backend.service";
import {navigation} from "../../../services/navigation.service";
import {KnowledgeService} from "../services/knowledge.service";
import {relatedmodels} from "../../../services/relatedmodels.service";

@Component({
    templateUrl: "./src/modules/knowledge/templates/knowledgemanager.html",
    providers: [model, KnowledgeService, relatedmodels]
})
export class KnowledgeManager implements AfterViewInit, OnDestroy {

    public config: any = {clickable: true, canadd: true, draggable: true};
    public activeTab: string = "tree";

    @ViewChild("maincontainer", {read: ViewContainerRef}) private maincontainer: ViewContainerRef;
    @ViewChild("tabsheadercontainer", {read: ViewContainerRef}) private tabsHeaderContainer: ViewContainerRef;

    constructor(private language: language,
                private model: model,
                private backend: backend,
                private metadata: metadata,
                private navigation: navigation,
                private relatedmodels: relatedmodels,
                private knowledgeService: KnowledgeService) {
        this.model.module = "KnowledgeBooks";
        this.prepareRelatedModel();
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
        }
    }

    get detailsContainerStyle() {
        if (this.maincontainer) {
            let rect = this.maincontainer.element.nativeElement;
            return {height: `calc(100vh - ${rect.offsetTop}px)`};
        }
    }

    get isLoading() {
        return this.knowledgeService.isLoading;
    }

    public ngAfterViewInit() {
        this.navigation.setActiveModule("KnowledgeBooks");
    }

    public handleAddEvent(parent) {
        this.model.reset();
        this.model.module = "KnowledgeDocuments";
        let presets = {
            parent_id: parent !== null ? parent.id : null,
            parent_name: parent !== null ? parent.name : "",
            knowledgebook_id: this.knowledgeService.selectedBook.id,
            status: "Draft"
        };
        this.model.addModel("", {}, presets)
            .subscribe(item => {
                if (typeof item === "object") {
                    this.knowledgeService.documents.push(item);
                    this.knowledgeService.sortDocuments();
                    this.knowledgeService.documents = this.knowledgeService.documents.slice();
                    this.knowledgeService.selectedId = item.id;
                }
            });
    }

    public ngOnDestroy() {
        this.relatedmodels.stopSubscriptions();
    }

    private prepareRelatedModel() {
        this.relatedmodels.module = "KnowledgeBooks";
        this.relatedmodels.relatedModule = "KnowledgeDocuments";
        this.relatedmodels.sort.sortfield = "name";
        this.relatedmodels.sort.sortdirection = "ASC";
        this.relatedmodels.loaditems = -1;
    }

    private saveListEdit(toEdit: any) {
        let data = {parent_id: toEdit.parent_id, parent_name: toEdit.parent_name};
        this.backend.save("KnowledgeDocuments", toEdit.id, data);
        for (let doc of this.knowledgeService.documents) {
            if (doc.id === toEdit.id) {
                doc.parent_id = toEdit.parent_id;
                doc.parent_name = toEdit.parent_name;
            }
        }
        this.knowledgeService.documents = this.knowledgeService.documents.slice();
        this.knowledgeService.selectedId = toEdit.id;
    }

    private handleSelectedItemEvent(id) {
        this.knowledgeService.selectedId = id;
    }
}
