/*
SpiceUI 2021.01.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

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
    templateUrl: "./src/modules/knowledge/templates/knowledgebookselector.html",
    providers: [model]
})
export class KnowledgeBookSelector {

    public searchTerm: string = "";
    public searchOpen: boolean = false;
    @ViewChild("inputcontainer", {read: ViewContainerRef, static: true}) private inputContainer: ViewContainerRef;
    @Input() private editable: boolean = true;

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

    private editBook(bookId) {
        this.model.id = bookId;
        this.model.edit(true);
        this.searchOpen = false;
    }

    private deleteBook(bookId) {
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

    private selectBook(book) {
        this.knowledgeService.selectedBook = book;
        this.knowledgeService.setLastViewedBook();
        this.searchOpen = false;
    }

    private deselectBook() {
        this.knowledgeService.selectedBook = undefined;
        this.knowledgeService.selectedDoc = "";
        this.knowledgeService.documents = [];
        this.knowledgeService.setLastViewedBook(true);

        // ToDo: check if we stiull need that or can avoid this for favs on the knkowledge books
        // this.knowledgeService.favoriteDisable();
    }

    private trackByFn(index, item) {
        return item.id;
    }
}
