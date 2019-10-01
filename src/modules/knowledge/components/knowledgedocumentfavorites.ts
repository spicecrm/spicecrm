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
    templateUrl: "./src/modules/knowledge/templates/knowledgedocumentfavorites.html"
})
export class KnowledgeDocumentFavorites {
    constructor(
        private language: language,
        private router: Router,
        private favorite: favorite,
        private location: Location,
        private knowledgeService: KnowledgeService,
    ) {
    }

    get favorites() {
        return this.favorite.getFavorites("KnowledgeDocuments");
    }

    private navigateTo(id) {
        this.knowledgeService.selectedDoc = id;
        this.location.replaceState("/module/KnowledgeDocuments/" + id);
    }

    private trackByFn(index, item) {
        return item.item_id;
    }
}
