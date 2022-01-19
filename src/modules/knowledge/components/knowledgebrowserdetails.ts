/**
 * @module ModuleKnowledge
 */
import {Component, Input, OnChanges, ViewChild, ViewContainerRef} from "@angular/core";
import {language} from "../../../services/language.service";
import {model} from "../../../services/model.service";
import {favorite} from "../../../services/favorite.service";
import {KnowledgeService} from "../services/knowledge.service";
import {KnowledgeBrowserDetailsContainerRight} from "./knowledgebrowserdetailscontainerright";

@Component({
    selector: "knowledge-browser-details",
    templateUrl: "../templates/knowledgebrowserdetails.html"
})
export class KnowledgeBrowserDetails implements OnChanges {

    @ViewChild('detailscontainer', {read: ViewContainerRef, static: true}) public detailsContainer: ViewContainerRef;
    @ViewChild(KnowledgeBrowserDetailsContainerRight, {static: true}) public rightPanelContainer;

    @Input("selectedDoc") public docId: string = "";
    @Input() public inAddModal: boolean = false;
    @Input() public footerContainer: any;

    constructor(public language: language,
                public favorite: favorite,
                public knowledgeService: KnowledgeService,
                public model: model) {
        this.model.module = "KnowledgeDocuments";
    }

    public _breadcrumbs: any[] = [];

    get containerLeftClass() {
        return this.inAddModal ? 'slds-size--1-of-1' : 'slds-size--2-of-3';
    }

    get breadcrumbs() {
        return this._breadcrumbs;
    }

    set breadcrumbs(value) {
        this._breadcrumbs = value;
    }

    get selectedBook() {
        return this.knowledgeService.selectedBook;
    }

    get detailsContainerStyle() {
        if (!this.detailsContainer) return {};
        let rect = this.detailsContainer.element.nativeElement;

        if (this.footerContainer && this.inAddModal) {
            let footerTop = this.footerContainer.parentElement.offsetTop;
            return {
                height: (footerTop - rect.offsetTop) + 'px',
            };
        }
        return {height: `calc(100vh - ${rect.offsetTop}px)`};
    }

    public ngOnChanges() {
        if (this.rightPanelContainer) {
            this.rightPanelContainer.resetView();
        }
        if (this.docId && this.docId.length > 0) {
            this.model.id = this.docId;
            if (this.rightPanelContainer) {
                this.rightPanelContainer.renderView();
            }

            // ToDo: check if we stiull need that or can avoid this for favs on the knkowledge books
            // this.knowledgeService.favoriteEnable(this.model.module, this.model.id);

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
