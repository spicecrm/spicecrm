import {Injectable, ViewChild, ViewContainerRef} from '@angular/core';
import {backend} from '../../../services/backend.service';
import {favorite} from "../../../services/favorite.service";
import {fts} from "../../../services/fts.service";


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
                private fts: fts) {
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

    public favoriteEnable(module, id) {
        this.favoriteDisable();
        this.favorite.enable(module, id);
    }

    public favoriteDisable() {
        this.favorite.disable();
    }

    public getBooks() {
        this.isLoading = true;
        this.backend.getList("KnowledgeBooks", "name", "DESC", ["name", "id"], {limit: -1})
            .subscribe((books: any) => {
                this.books = books.list;
                this.isLoading = false;
            });
    }

    public getDocuments(bookId) {
        this.isLoading = true;
        this.backend.getRequest(`module/KnowledgeDocuments/${bookId}/items`).subscribe((docs: any) => {
            this.documents = docs;
            this.isLoading = false;
        });
    }
}
