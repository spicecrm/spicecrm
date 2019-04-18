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


@Injectable()

export class KnowledgeService implements OnDestroy {
    public selectedBook: any;
    public documents: any[] = [];
    public selectedId: string = "";
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
                public userPreferences: userpreferences,
                private fts: fts) {
        this.userPreferences.loadPreferences('KnowledgeBooks')
            .pipe(take(1))
            .subscribe(res => {
                if (res && res['lastViewedBook']) {
                    this.selectedBook = res['lastViewedBook'];
                    this.getDocuments(this.selectedBook.id);
                }
            });
        this.subscription = this.broadcast.message$.subscribe(msg => {
            if (msg.messagetype == "model.save" && msg.messagedata.module == "KnowledgeBooks") {
                let book = msg.messagedata.data;
                this.books = [...this.books, book];
                this.selectedBook = book;
                this.getDocuments(book.id);
            }
        });
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

    public setLastViewedBook(none = false) {
        let value = none ? null : this.selectedBook;
        this.userPreferences.setPreference("lastViewedBook", value, true, "KnowledgeBooks");
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
                if (pref['KnowledgeBooks'] && pref['KnowledgeBooks']['lastViewedBook'] && !this.selectedBook) {
                    let lastViewedBook = pref['KnowledgeBooks']['lastViewedBook'];
                    this.selectedBook = lastViewedBook;
                    this.getDocuments(lastViewedBook);
                }
            });
    }

    public getDocuments(bookId) {
        this.isLoading = true;
        this.relatedmodels.id = bookId;
        this.relatedmodels.items$
            .pipe(take(1))
            .subscribe((docs: any[]) => {
                this.documents = docs;
                this.sortDocuments();
                this.isLoading = false;
            });
        this.relatedmodels.getData();
    }

    public sortDocuments() {
        this.documents.sort((a, b) => {
            if (+a.parent_sequence == +b.parent_sequence) {
                return a.name - b.name;
            } else {
                return a.parent_sequence - b.parent_sequence;
            }
        });
        return this.documents.sort(function (a, b) {
            if (+a.parent_sequence == +b.parent_sequence) {
                var nameA = a.name.toUpperCase();
                var nameB = b.name.toUpperCase();
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

    public ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
