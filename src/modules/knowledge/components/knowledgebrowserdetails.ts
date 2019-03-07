/**
 * @module ModuleKnowledge
 */
import {Component, Input, OnChanges, ViewChild, ViewContainerRef} from "@angular/core";
import {language} from "../../../services/language.service";
import {model} from "../../../services/model.service";
import {favorite} from "../../../services/favorite.service";
import {KnowledgeService} from "../services/knowledge.service";

@Component({
    selector: "knowledge-browser-details",
    templateUrl: "./src/modules/knowledge/templates/knowledgebrowserdetails.html"
})
export class KnowledgeBrowserDetails implements OnChanges {

    @ViewChild('detailscontainer', {read: ViewContainerRef}) private detailsContainer: ViewContainerRef;

    @Input("selectedId") private docId: string = "";

    constructor(private language: language,
                private favorite: favorite,
                private knowledgeService: KnowledgeService,
                private model: model) {
        this.model.module = "KnowledgeDocuments";
    }

    private _breadcrumbs: any[] = [];

    get selectedBook() {
        return this.knowledgeService.selectedBook;
    }

    get breadcrumbs() {
        return this._breadcrumbs;
    }

    set breadcrumbs(value) {
        this._breadcrumbs = value;
    }

    get detailsContainerStyle() {
        if (this.detailsContainer) {
            let rect = this.detailsContainer.element.nativeElement;
            return {height: `calc(100vh - ${rect.offsetTop}px)`};
        }
        return {};
    }

    public ngOnChanges() {
        if (this.docId && this.docId !== "") {
            this.model.id = this.docId;
            this.knowledgeService.favoriteEnable(this.model.module, this.model.id);
            this.breadcrumbs = [];
            this.model.getData(true, "", true)
                .subscribe(data => {
                    if (data.breadcrumbs && data.breadcrumbs.length > 0) {
                        this.breadcrumbs = data.breadcrumbs;
                    }
                });
        }
    }
}
