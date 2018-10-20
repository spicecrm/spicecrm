import {Component, ViewChild, ViewContainerRef} from "@angular/core";
import {metadata} from "../../../services/metadata.service";
import {language} from "../../../services/language.service";
import {backend} from "../../../services/backend.service";
import {model} from "../../../services/model.service";
import {KnowledgeService} from "../services/knowledge.service";
import {navigation} from "../../../services/navigation.service";

@Component({
    selector: "knowledge-book-selector",
    templateUrl: "./src/modules/knowledge/templates/knowledgebookselector.html",
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
export class KnowledgeBookSelector {

    public searchTerm: string = "";
    public searchOpen: boolean = false;
    @ViewChild("inputcontainer", {read: ViewContainerRef}) private inputContainer: ViewContainerRef;

    constructor(public language: language,
                public model: model,
                public metadata: metadata,
                public knowledgeService: KnowledgeService,
                public navigation: navigation,
                public backend: backend) {
        this.knowledgeService.getBooks();
    }

    get isLoading() {
        return this.knowledgeService.isLoading;
    }

    get selectedBook() {
        return this.knowledgeService.selectedBook;
    }

    get books() {
        return this.knowledgeService.books;
    }

    get searchResults() {
        let resultsArray: any[] = [];
        for (let book of this.books) {
            if (this.searchTerm != "" && book.name.toLowerCase().includes(this.searchTerm.toLowerCase())) {
                resultsArray.push(book);
            }
        }

        return resultsArray.length == 0 ? this.books.slice() : resultsArray;
    }

    get lookupMenuStyle() {
        return {
            display: this.searchOpen ? "block" : "none",
            width: this.inputContainer.element.nativeElement.getBoundingClientRect().width + "px",
        };
    }

    private selectBook(book) {
        this.knowledgeService.selectedBook = book;
        this.knowledgeService.getDocuments(book.id);
        this.searchOpen = false;
    }

    private deselectBook() {
        this.knowledgeService.selectedBook = undefined;
        this.knowledgeService.selectedId = "";
        this.knowledgeService.documents = [];
        this.knowledgeService.favoriteDisable();
    }
}
