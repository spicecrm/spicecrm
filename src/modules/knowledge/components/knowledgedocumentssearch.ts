/**
 * @module ModuleKnowledge
 */
import {Component, ViewChild, ViewContainerRef} from "@angular/core";
import {metadata} from "../../../services/metadata.service";
import {language} from "../../../services/language.service";
import {backend} from "../../../services/backend.service";
import {model} from "../../../services/model.service";
import {KnowledgeService} from "../services/knowledge.service";
import {navigation} from "../../../services/navigation.service";

@Component({
    selector: "knowledge-documents-search",
    templateUrl: "./src/modules/knowledge/templates/knowledgedocumentssearch.html"
})
export class KnowledgeDocumentsSearch {

    public isLoading: boolean = false;
    public interval: any = undefined;
    @ViewChild("inputcontainer", {read: ViewContainerRef}) private inputContainer: ViewContainerRef;

    constructor(public language: language,
                public model: model,
                public metadata: metadata,
                public knowledgeService: KnowledgeService,
                public navigation: navigation,
                public backend: backend) {
    }

    get resultsList() {
        return this.knowledgeService.resultsList;
    }

    get searchTerm() {
        return this.knowledgeService.searchterm;
    }

    set searchTerm(value) {
        clearTimeout(this.interval);
        this.interval = setTimeout(() => this.knowledgeService.searchTerm = value, 500);
    }

    get resultsMenuStyle() {
        if (this.inputContainer) {
            let rect = this.inputContainer.element.nativeElement.getBoundingClientRect();
            return {height: `calc(98vh - ${rect.bottom}px)`};
        }
    }

    public clearSearch() {
        this.knowledgeService.searchTerm = "";
        this.knowledgeService.resultsList = [];
    }

    private selectDocument(doc) {
        this.knowledgeService.selectedDoc = doc.id;
        this.knowledgeService.selectedBook = {id: doc.knowledgebook_id, name: doc.knowledgebook_name};
    }

    private trackByFn(index, item) {
        return item.id;
    }
}
