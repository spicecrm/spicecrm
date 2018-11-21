import {Injectable, ViewChild, ViewContainerRef} from '@angular/core';
import {backend} from '../../../services/backend.service';
import {favorite} from "../../../services/favorite.service";
import {fts} from "../../../services/fts.service";
import {broadcast} from "../../../services/broadcast.service";
import {userpreferences} from "../../../services/userpreferences.service";


@Injectable()

export class KnowledgeService {
    public selectedBook: any = undefined;
    public documents: any[] = [];
    public selectedId: string = "";
    public isLoading: boolean = false;
    public books: any[] = [];
    public searchterm: string = "";
    public resultsList: any[] = [];

    @ViewChild("searchcontainer", {read: ViewContainerRef}) private searchContainer: ViewContainerRef;

    constructor(private backend: backend,
                private favorite: favorite,
                private broadcast: broadcast,
                public userPreferences: userpreferences,
                private fts: fts) {
        this.broadcast.message$.subscribe(msg => {
            if (msg.messagetype == "model.save" && msg.messagedata.module == "KnowledgeDocuments") {
                this.getDocuments(this.selectedBook.id);
            }
            if (msg.messagetype == "model.save" && msg.messagedata.module == "KnowledgeBooks") {
                this.getBooks();
            }
        });

    }

    get searchTerm() {
        return this.searchterm;
    }

    set searchTerm(value) {
        this.searchterm = value;
        if (value == "") {
            return;
        }
        let module = "KnowledgeDocuments";
        this.isLoading = true;
        this.fts.searchByModules(this.searchterm, [module], 5, "", {sortfield: "name"})
            .subscribe(res => {
                this.resultsList = res[module].hits.map(doc => doc = doc._source);
                this.isLoading = false;
            });
    }

    public setLastViewedBook(none = false) {
        let value = none ? null : this.selectedBook.id;
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
        this.isLoading = true;
        this.backend.getList("KnowledgeBooks", "name", "DESC", ["name", "id", "html"], {limit: -1})
            .subscribe((books: any) => {
                this.books = books.list;
                this.isLoading = false;
                this.userPreferences.loadPreferences("KnowledgeBooks")
                    .subscribe(pref => this.selectedBook = this.books.find(book => book.id == pref.lastViewedBook));
            });
    }

    public getDocuments(bookId) {
        this.isLoading = true;
        this.backend.getRequest(`module/KnowledgeDocuments/${bookId}/items`).subscribe((docs: any) => {
            this.documents = docs;
            this.sortDocuments();
            this.isLoading = false;
        });
    }

    public sortDocuments() {
         this.documents.sort((a,b) => {
            if (+a.parent_sequence == +b.parent_sequence) {
                return a.name - b.name;
            } else {
                return a.parent_sequence - b.parent_sequence;
            }
        });
        return this.documents.sort(function(a, b) {
            if (+a.parent_sequence == +b.parent_sequence) {
                var nameA = a.name.toUpperCase();
                var nameB = b.name.toUpperCase();
                if (nameA < nameB) {return -1}
                if (nameA > nameB) {return 1}
            } else {
                if (+a.parent_sequence < +b.parent_sequence) {return -1}
                if (+a.parent_sequence > +b.parent_sequence) {return 1}
            }
        });
    }
}
