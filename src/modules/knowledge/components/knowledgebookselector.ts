/**
 * @module ModuleKnowledge
 */
import {Component, Input, ViewChild, ViewContainerRef} from "@angular/core";
import {metadata} from "../../../services/metadata.service";
import {language} from "../../../services/language.service";
import {backend} from "../../../services/backend.service";
import {model} from "../../../services/model.service";
import {modal} from "../../../services/modal.service";
import {KnowledgeService} from "../services/knowledge.service";
import {navigation} from "../../../services/navigation.service";

@Component({
    selector: "knowledge-book-selector",
    templateUrl: "../templates/knowledgebookselector.html",
    providers: [model]
})
export class KnowledgeBookSelector {

    public searchTerm: string = "";
    public searchOpen: boolean = false;
    @ViewChild("inputcontainer", {read: ViewContainerRef, static: true}) public inputContainer: ViewContainerRef;
    @Input() public editable: boolean = true;

    constructor(public language: language,
                public model: model,
                public modal: modal,
                public metadata: metadata,
                public knowledgeService: KnowledgeService,
                public navigation: navigation,
                public backend: backend) {
        this.model.module = 'KnowledgeBooks';
        this.knowledgeService.getBooks();
    }

    get placeHolder() {
        return !this.isLoading && this.books.length == 0 ? this.language.getLabel('LBL_NO_ENTRIES') : this.language.getLabel('MSG_SEARCH_BOOKS');
    }

    get isLoading() {
        return this.knowledgeService.isBookLoading;
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

    public editBook(bookId) {
        this.model.id = bookId;
        this.model.edit(true);
        this.searchOpen = false;
    }

    public deleteBook(bookId) {
        this.model.id = bookId;
        this.modal.confirm(this.language.getLabel('MSG_DELETE_RECORD'), this.language.getLabel('LBL_DELETE')).subscribe(answer => {
            if (answer) {
                this.model.delete().subscribe(res => {
                    this.deselectBook();
                    this.knowledgeService.books = this.knowledgeService.books.filter(book => book.id != bookId);
                });
            }
        });
    }

    public selectBook(book) {
        this.knowledgeService.selectedBook = book;
        this.knowledgeService.setLastViewedBook();
        this.searchOpen = false;
    }

    public deselectBook() {
        this.knowledgeService.selectedBook = undefined;
        this.knowledgeService.selectedDoc = "";
        this.knowledgeService.documents = [];
        this.knowledgeService.setLastViewedBook(true);

        // ToDo: check if we stiull need that or can avoid this for favs on the knkowledge books
        // this.knowledgeService.favoriteDisable();
    }

    public trackByFn(index, item) {
        return item.id;
    }
}
