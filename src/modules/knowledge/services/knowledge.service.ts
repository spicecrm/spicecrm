/**
 * @module ModuleKnowledge
 */
import {Injectable, OnDestroy, ViewChild, ViewContainerRef} from '@angular/core';
import {backend} from '../../../services/backend.service';
import {favorite} from "../../../services/favorite.service";
import {fts} from "../../../services/fts.service";
import {broadcast} from "../../../services/broadcast.service";
import {userpreferences} from "../../../services/userpreferences.service";
import {take} from "rxjs/operators";
import {Subscription} from "rxjs";
import {relatedmodels} from "../../../services/relatedmodels.service";
import {navigation} from "../../../services/navigation.service";
import {Location} from "@angular/common";
import {toast} from "../../../services/toast.service";
import {language} from "../../../services/language.service";
import {metadata} from "../../../services/metadata.service";
import {ActivatedRoute} from "@angular/router";


@Injectable()

export class KnowledgeService implements OnDestroy {
    public selectedbook: any;
    public selectedDoc: string = "";
    public isLoading: boolean = false;
    public books: any[] = [];
    public searchterm: string = "";
    public resultsList: any[] = [];
    private subscriptions: Subscription = new Subscription();

    @ViewChild("searchcontainer", {read: ViewContainerRef}) private searchContainer: ViewContainerRef;

    constructor(private backend: backend,
                private language: language,
                private favorite: favorite,
                private broadcast: broadcast,
                private relatedmodels: relatedmodels,
                private navigation: navigation,
                public userPreferences: userpreferences,
                private location: Location,
                private activatedRoute: ActivatedRoute,
                private toast: toast,
                private metadata: metadata,
                private fts: fts) {
        this.prepareRelatedModel();
        this.loadPreferences();
        this.saveSubscriber();
        this.routerSubscriber();
    }

    get documents() {
        return this.sortDocuments(this.relatedmodels.items);
    }

    set documents(value: any[]) {
        this.relatedmodels.items = value;
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
        this.isLoading = true;
        let sortParams = {sortfield: "name", sortdirection: "ASC"};

        this.fts.searchByModules(this.searchterm, [module], 5, "", sortParams)
            .subscribe(res => {
                this.resultsList = res[module].hits
                    .map(doc => doc._source)
                    .sort((a, b) => a.name - b.name);
                this.isLoading = false;
            });
    }

    get selectedBook() {
        return this.selectedbook;
    }

    set selectedBook(book) {
        this.selectedbook = book;
        this.getDocuments(book);
        if (book) this.favoriteEnable('KnowledgeBooks', book.id);
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

    public favoriteEnable(module, id) {
        this.favoriteDisable();
        this.favorite.enable(module, id);
    }

    public favoriteDisable() {
        this.favorite.disable();
    }

    public getBooks() {
        this.backend.getList("KnowledgeBooks", "name", "DESC", ["name", "id", "html"], {limit: -1})
            .subscribe((books: any) => {
                this.books = books && books.list ? books.list : [];
                let pref = this.userPreferences.unchangedPreferences;
            });
    }

    public getDocuments(book) {
        if (!book || !book.id) {
            return;
        }
        this.relatedmodels.id = book.id;
        this.relatedmodels.getData();
    }

    public ngOnDestroy() {
        this.relatedmodels.stopSubscriptions();
    }

    private prepareRelatedModel() {
        this.relatedmodels.module = "KnowledgeBooks";
        this.relatedmodels.relatedModule = "KnowledgeDocuments";
        this.relatedmodels.sort.sortfield = "name";
        this.relatedmodels.sort.sortdirection = "ASC";
        this.relatedmodels.loaditems = -1;
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
            if (msg.messagetype == "model.save" && msg.messagedata.module == "KnowledgeBooks") {
                let book = msg.messagedata.data;
                this.books = [...this.books, book];
                this.selectedBook = book;
            }
        });
        this.subscriptions.add(subscriber);
    }

    private sortDocuments(docs) {
        docs.sort((a, b) => {
            if (+a.parent_sequence == +b.parent_sequence) {
                return a.name - b.name;
            } else {
                return a.parent_sequence - b.parent_sequence;
            }
        });
        return docs.sort((a, b) => {
            if (+a.parent_sequence == +b.parent_sequence) {
                let nameA = a.name.toUpperCase();
                let nameB = b.name.toUpperCase();
                if (nameA < nameB) {
                    return -1;
                }
                if (nameA > nameB) {
                    return 1;
                }
            } else {
                if (+a.parent_sequence < +b.parent_sequence) {
                    return -1;
                }
                if (+a.parent_sequence > +b.parent_sequence) {
                    return 1;
                }
            }
        });
    }



    private routerSubscriber() {
        let subscriber = this.activatedRoute.params.subscribe(params => {
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
