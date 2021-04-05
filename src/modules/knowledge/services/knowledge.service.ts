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
import {Injectable, ViewChild, ViewContainerRef} from '@angular/core';
import {backend} from '../../../services/backend.service';
import {fts} from "../../../services/fts.service";
import {broadcast} from "../../../services/broadcast.service";
import {modelutilities} from "../../../services/modelutilities.service";
import {userpreferences} from "../../../services/userpreferences.service";
import {take} from "rxjs/operators";
import {Subscription} from "rxjs";
import {navigation} from "../../../services/navigation.service";
import {Location} from "@angular/common";
import {toast} from "../../../services/toast.service";
import {navigationtab} from "../../../services/navigationtab.service";
import {language} from "../../../services/language.service";
import {metadata} from "../../../services/metadata.service";
import {ActivatedRoute} from "@angular/router";

declare var _;

@Injectable()

export class KnowledgeService {
    public selectedbook: any;
    public selectedDoc: string = "";
    public isBookLoading: boolean = false;
    public isDocumentLoading: boolean = false;
    public books: any[] = [];
    public searchterm: string = "";
    public moduleFilter: string = "";
    public resultsList: any[] = [];
    public documentsList: any[] = [];
    private subscriptions: Subscription = new Subscription();

    @ViewChild("searchcontainer", {read: ViewContainerRef, static: true}) private searchContainer: ViewContainerRef;

    constructor(private backend: backend,
                private language: language,
                private broadcast: broadcast,
                private modelutilities: modelutilities,
                private navigation: navigation,
                public userPreferences: userpreferences,
                private location: Location,
                private activatedRoute: ActivatedRoute,
                private toast: toast,
                private metadata: metadata,
                private navigationtab: navigationtab,
                private fts: fts) {
        this.loadPreferences();
        this.saveSubscriber();
        this.routerSubscriber();
    }

    get documents() {
        return this.sortDocuments(this.documentsList);
    }

    set documents(value: any[]) {
        this.documentsList = value;
    }

    get searchTerm() {
        return this.searchterm;
    }

    set searchTerm(value) {
        this.searchterm = value;
        this.resultsList = [];
        if (value == "") {
            return;
        }
        let module = "KnowledgeDocuments";
        this.isDocumentLoading = true;
        let sortParams = {sortfield: "name", sortdirection: "ASC"};

        this.fts.searchByModules({searchterm: this.searchterm, modules: [module], size: 5, sortparams: sortParams})
            .subscribe(res => {
                this.resultsList = res[module].hits
                    .map(doc => doc._source)
                    .sort((a, b) => a.name - b.name);
                this.isDocumentLoading = false;
            });
    }

    get selectedBook() {
        return this.selectedbook;
    }

    set selectedBook(book) {
        this.selectedbook = book;
        this.getDocuments(book);

    }

    public setActiveModule(module) {
        this.navigation.setActiveModule(module);
    }

    public setLastViewedBook(none = false) {
        let book = !none && this.selectedBook ? this.selectedBook : null;
        this.userPreferences.setPreference("lastViewedBook", book, true, "KnowledgeBooks");
    }

    public replaceState(state) {
        this.location.replaceState(state);
    }


    public getBooks() {
        this.isBookLoading = true;
        this.backend.getList("KnowledgeBooks", [{sortfield:"name", sortdirection:"DESC"}], ["name", "id", "html"], {limit: -1})
            .subscribe((books: any) => {
                this.books = books && books.list ? books.list : [];
                this.isBookLoading = false;
            });
    }

    public getDocuments(book) {
        if (!book || !book.id) {
            return;
        }
        this.isDocumentLoading = true;
        this.documentsList = [];

        if (this.metadata.checkModuleAcl("KnowledgeDocuments", "list") === false) return;

        let params = {
            limit: -1,
            modulefilter: this.moduleFilter,
            sort: {sortfield: "name", sortdirection: "ASC"}
        };

        this.backend.getRequest(`module/KnowledgeBooks/${book.id}/related/knowledgedocuments`, params)
            .subscribe(
                (response: any) => {
                    this.documents = this.moduleFilter.length > 0 ? _.toArray(response) : _.toArray(response).map(item => {
                        return {
                            id: item.id,
                            parent_id: item.parent_id,
                            parent_sequence: item.parent_sequence,
                            name: `${item.name} (${item.status})`
                        };
                    });
                    this.isDocumentLoading = false;
                }
            );
    }

    private loadPreferences() {
        this.userPreferences.loadPreferences('KnowledgeBooks')
            .pipe(take(1))
            .subscribe(prefs => {
                if (prefs && prefs.lastViewedBook && !this.selectedBook) {
                    this.selectedBook = prefs.lastViewedBook;
                }
            });
    }

    private saveSubscriber() {
        let subscriber = this.broadcast.message$.subscribe(msg => {
            if (msg.messagetype == "model.save") {
                switch (msg.messagedata.module) {
                    case "KnowledgeBooks":
                        let book = msg.messagedata.data;
                        this.books = [...this.books, book];
                        this.selectedBook = book;
                        break;
                    case "KnowledgeDocuments":
                        let found = this.documents.some(item => {
                            if (item.id == msg.messagedata.id) {
                                item.parent_id = msg.messagedata.data.parent_id;
                                item.parent_sequence = msg.messagedata.data.parent_sequence;
                                item.name = this.moduleFilter.length > 0 ? item.name : `${msg.messagedata.data.name} (${msg.messagedata.data.status})`;
                                return true;
                            }
                        });

                        if (!found) {
                            let newItem = {
                                id: msg.messagedata.data.id,
                                parent_id: msg.messagedata.data.parent_id,
                                parent_sequence: msg.messagedata.data.parent_sequence,
                                name: this.moduleFilter.length > 0 ? msg.messagedata.data.name : `${msg.messagedata.data.name} (${msg.messagedata.data.status})`
                            };
                            this.documents = [...this.documentsList, newItem];
                        } else {
                            this.documents = this.documentsList.slice();
                        }
                        break;
                }
            }

            if (msg.messagetype == "model.delete" && msg.messagedata.module == "KnowledgeDocuments") {
                this.documents = this.documents.filter(item => item.id != msg.messagedata.id);
                this.selectedDoc = "";
                this.replaceState("/module/KnowledgeDocuments");
            }
        });
        this.subscriptions.add(subscriber);
    }

    private sortDocuments(docs) {
        return docs.sort((a, b) => {
            if (+a.parent_sequence != +b.parent_sequence) {
                return +a.parent_sequence > +b.parent_sequence ? 1 : -1;
            } else {
                return a.name > b.name ? 1 : -1;
            }
        });
    }



    private routerSubscriber() {
        let subscriber = this.navigationtab.activeRoute$.subscribe(route => {
            let params = route.params;
            if (!params.module) return;
            if (params.id) {
                this.backend.get(params.module, params.id).subscribe((item: any) => {
                    if (!item) return;
                    switch (params.module) {
                        case 'KnowledgeBooks':
                            this.selectedBook = item;
                            break;
                        case 'KnowledgeDocuments':
                            this.selectedDoc = item.id;
                            this.selectedBook = {
                                id: item.knowledgebook_id,
                                name: item.knowledgebook_name
                            };
                            break;
                    }
                });
            }
        });
        this.subscriptions.add(subscriber);
    }
}
