import {Component, Input, ViewChild, ViewContainerRef, OnChanges} from "@angular/core";
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
    private _breadcrumbs: any[] = [];

    constructor(private language: language,
                private favorite: favorite,
                private knowledgeService: KnowledgeService,
                private model: model) {
        this.model.module = "KnowledgeDocuments";
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

    set breadcrumbs(value) {
        this._breadcrumbs = value;
    }

    get breadcrumbs() {
        return this._breadcrumbs;
    }

    get detailsContainerStyle() {
        if (this.detailsContainer) {
            let rect = this.detailsContainer.element.nativeElement;
            return {height: `calc(100vh - ${rect.offsetTop}px)`};
        }
        return {};
    }
}
