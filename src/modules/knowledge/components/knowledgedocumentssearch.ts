import {Component, Input, ViewChild, ViewContainerRef} from "@angular/core";
import {metadata} from "../../../services/metadata.service";
import {language} from "../../../services/language.service";
import {backend} from "../../../services/backend.service";
import {model} from "../../../services/model.service";
import {KnowledgeService} from "../services/knowledge.service";
import {navigation} from "../../../services/navigation.service";

@Component({
    selector: "knowledge-documents-search",
    templateUrl: "./src/modules/knowledge/templates/knowledgedocumentssearch.html",
    styles: [`

        /* Scrollbar */

        /* width */
        ::-webkit-scrollbar {
            width: 5px;
        }

        /* Track */
        ::-webkit-scrollbar-track {
            background: #f1f1f1;
        }

        /* Handle */
        ::-webkit-scrollbar-thumb {
            background: #aaa;
        }

        /* Handle on hover */
        ::-webkit-scrollbar-thumb:hover {
            background: #888;
        }
    `]
})
export class KnowledgeDocumentsSearch {

    @ViewChild("inputcontainer", {read: ViewContainerRef}) private inputContainer: ViewContainerRef;

    public searchTerm: string = "";

    constructor(public language: language,
                public model: model,
                public metadata: metadata,
                public knowledgeService: KnowledgeService,
                public navigation: navigation,
                public backend: backend) {
    }

    get isLoading() {
        return this.knowledgeService.isLoading;
    }

    get searchResults() {
        let resultsArray: any[] = [];
        for (let doc of this.knowledgeService.documents) {
            if (this.searchTerm != "" && doc.name.toLowerCase().includes(this.searchTerm.toLowerCase())) {
                resultsArray.push(doc);
            }
        }
        return resultsArray;
    }

    get resultsMenuStyle() {
        if (this.inputContainer) {
            let rect = this.inputContainer.element.nativeElement.getBoundingClientRect();
            return {height: `calc(98vh - ${rect.bottom}px)`};
        }
    }

    private selectDocument(id) {
        this.knowledgeService.selectedId = id;
    }
}
