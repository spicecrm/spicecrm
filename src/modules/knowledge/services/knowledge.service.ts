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
import {ActivatedRoute, Router} from "@angular/router";
import {model} from "../../../services/model.service";
import {navigation} from "../../../services/navigation.service";
import {Location} from "@angular/common";


@Injectable()

export class KnowledgeService implements OnDestroy {
    public selectedbook: any;
    public selectedDoc: string = "";
    public isLoading: boolean = false;
    public books: any[] = [];
    public searchterm: string = "";
    public resultsList: any[] = [];
    private subscription: Subscription = new Subscription();

    @ViewChild("searchcontainer", {read: ViewContainerRef}) private searchContainer: ViewContainerRef;

    constructor(private backend: backend,
                private favorite: favorite,
                private broadcast: broadcast,
                private relatedmodels: relatedmodels,
                private model: model,
                private navigation: navigation,
                private activatedRoute: ActivatedRoute,
                public userPreferences: userpreferences,
                private location: Location,
                private router: Router,
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
                if (pref.KnowledgeBooks && pref.KnowledgeBooks.lastViewedBook && !this.selectedBook) {
                    this.selectedBook = pref.KnowledgeBooks.lastViewedBook;
                }
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
        this.subscription.unsubscribe();
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
            .subscribe(res => {
                if (res && res.lastViewedBook) {
                    this.selectedBook = res.lastViewedBook;
                }
            });
    }

    private saveSubscriber() {
        this.subscription = this.broadcast.message$.subscribe(msg => {
            if (msg.messagetype == "model.save" && msg.messagedata.module == "KnowledgeBooks") {
                let book = msg.messagedata.data;
                this.books = [...this.books, book];
                this.selectedBook = book;
            }
        });
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
        this.subscription = this.activatedRoute.params.subscribe(params => {
            if (!params.id || !params.module) {
                return;
            }

            if (params.module == "KnowledgeDocuments") {
                this.model.module = params.module;
                this.model.id = params.id;
                this.selectedId = params.id;
                this.model.getData(true).subscribe(data => {
                    if (!data) {
                        return;
                    }
                    if (!this.model.checkAccess('edit')) {
                        this.router.navigate(['module/KnowledgeBooks/browser']);
                    }
                    this.navigation.setActiveModule("KnowledgeBooks", data.knowledgebook_id, data.knowledgebook_name);
                    if (!this.selectedBook) {
                        this.selectedBook = {id: data.knowledgebook_id, name: data.knowledgebook_name};
                    }
                });
            }

            if (params.module == "KnowledgeBooks") {
                this.backend.get("KnowledgeBooks", params.id, 'details').subscribe((book: any) => {
                    this.navigation.setActiveModule("KnowledgeBooks", book.id, book.name);
                    this.selectedBook = book;
                });
            }
        });
    }
}
