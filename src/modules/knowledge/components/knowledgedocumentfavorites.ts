/**
 * @module ModuleKnowledge
 */
import {Component} from "@angular/core";
import {favorite} from "../../../services/favorite.service";
import {language} from "../../../services/language.service";
import {KnowledgeService} from "../services/knowledge.service";
import {Router} from '@angular/router';
import {Location} from "@angular/common";

@Component({
    selector: "Knowledge-document-favorites",
    templateUrl: "../templates/knowledgedocumentfavorites.html"
})
export class KnowledgeDocumentFavorites {
    constructor(
        public language: language,
        public router: Router,
        public favorite: favorite,
        public location: Location,
        public knowledgeService: KnowledgeService,
    ) {
    }

    get favorites() {
        return this.favorite.getFavorites("KnowledgeDocuments");
    }

    public navigateTo(id) {
        this.knowledgeService.selectedDoc = id;
        this.location.replaceState("/module/KnowledgeDocuments/" + id);
    }

    public trackByFn(index, item) {
        return item.item_id;
    }
}
