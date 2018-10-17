import {Injectable, ViewChild, ViewContainerRef} from '@angular/core';
import {backend} from '../../../services/backend.service';
import {favorite} from "../../../services/favorite.service";
import {model} from "../../../services/model.service";


@Injectable()
export class KnowledgeService {
    public selectedBook: any = undefined;
    public documents: any[] = [];
    public selectedId: string = "";
    public isLoading: boolean = false;
    public books: any[] = [];

    @ViewChild("searchcontainer", {read: ViewContainerRef}) private searchContainer: ViewContainerRef;

    constructor(private backend: backend,private favorite: favorite, private model: model) {
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

    public getDocuments(id) {
        this.isLoading = true;
        this.backend.getRequest(`module/KnowledgeDocuments/${id}/items`).subscribe((docs: any) => {
            this.documents = docs;
            this.isLoading = false;
        });
    }
}
