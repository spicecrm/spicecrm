/**
 * @module ModuleKnowledge
 */
import {Component, EventEmitter, Input, ViewChild, ViewContainerRef} from "@angular/core";
import {metadata} from "../../../services/metadata.service";
import {language} from "../../../services/language.service";
import {backend} from "../../../services/backend.service";
import {model} from "../../../services/model.service";
import {modal} from "../../../services/modal.service";
import {KnowledgeService} from "../services/knowledge.service";
import {navigation} from "../../../services/navigation.service";
import {configurationService} from "../../../services/configuration.service";

@Component({
    selector: "knowledge-book-selector",
    templateUrl: "../templates/knowledgebookselector.html",
    providers: [model]
})
export class KnowledgeBookSelector {

    public searchTerm: string = "";
    public searchOpen: boolean = false;

    public templates: any[] = [];
    public modalTitle: string;
    public noDownload: boolean;
    public handBack: EventEmitter<string>;
    public buttonText: string;

    @ViewChild("inputcontainer", {read: ViewContainerRef, static: true}) public inputContainer: ViewContainerRef;
    @Input() public editable: boolean = true;

    constructor(public language: language,
                public model: model,
                public modal: modal,
                public metadata: metadata,
                public knowledgeService: KnowledgeService,
                public navigation: navigation,
                public backend: backend,
                public configuration: configurationService,
                public viewContainerRef: ViewContainerRef) {
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

    public editBook(bookToEdit) {
        this.model.id = bookToEdit.id;
        this.model.acl = bookToEdit.acl;
        this.model.edit(true);
        this.searchOpen = false;
    }

    public printBook(bookToPrint) {
        this.model.id = bookToPrint.id;
        this.model.acl = bookToPrint.acl;
        this.searchOpen = false;


        let waitingModal: any;

        let outPutTemplates = this.configuration.getData('OutputTemplates');
        if (outPutTemplates && outPutTemplates[this.model.module]) {
            this.templates = outPutTemplates[this.model.module];
            this.openOutput();
        } else {
            outPutTemplates = {};
            this.modal.openModal('SystemLoadingModal', false).subscribe(waitingModal => {
                waitingModal.instance.messagelabel = 'Loading Templates';
                this.backend.getRequest('module/OutputTemplates/formodule/'+this.model.module, {}).subscribe(
                    (data: any) => {
                        // kill the watign modal
                        waitingModal.instance.self.destroy();
                        // set the templates
                        this.configuration.setData('OutputTemplates', data);

                        // set the templates internally
                        this.templates = data;

                        // open the output
                        this.openOutput();
                    },
                    (error: any) => {
                        waitingModal.instance.self.destroy();
                    }
                );
            });
        }

    }

    public openOutput() {
        if (this.templates.length > 0) {
            // sort the templates
            this.templates.sort((a, b) => a.name > b.name ? 1 : -1);

            // open the modal
            this.modal.openModal('ObjectActionOutputBeanModal', true, this.viewContainerRef.injector).subscribe(outputModal => {
                outputModal.instance.templates = this.templates;
                outputModal.instance.modalTitle = this.modalTitle;
                outputModal.instance.noDownload = this.noDownload;
                outputModal.instance.handBack = this.handBack;
                outputModal.instance.buttonText = this.buttonText;
            });
        } else {
            this.modal.info('No Templates Found', 'there are no Output templates defined for the Module');
        }
    }

    public deleteBook(bookToDelete) {
        this.model.id = bookToDelete.id;
        this.model.acl = bookToDelete.acl;
        this.modal.confirm(this.language.getLabel('MSG_DELETE_RECORD'), this.language.getLabel('LBL_DELETE')).subscribe(answer => {
            if (answer) {
                this.model.delete().subscribe(res => {
                    this.deselectBook();
                    this.knowledgeService.books = this.knowledgeService.books.filter(book => book.id != bookToDelete.id);
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
