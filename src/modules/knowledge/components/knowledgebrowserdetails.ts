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
    templateUrl: "./src/modules/knowledge/templates/knowledgebrowserdetails.html"
})
export class KnowledgeBrowserDetails implements OnChanges {

    @ViewChild('detailscontainer', {read: ViewContainerRef, static: false}) private detailsContainer: ViewContainerRef;
    @ViewChild(KnowledgeBrowserDetailsContainerRight, {static: false}) private rightPanelContainer;

    @Input("selectedDoc") private docId: string = "";
    @Input() private inAddModal: boolean = false;
    @Input() private footerContainer: any;

    constructor(private language: language,
                private favorite: favorite,
                private knowledgeService: KnowledgeService,
                private model: model) {
        this.model.module = "KnowledgeDocuments";
    }

    private _breadcrumbs: any[] = [];

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
