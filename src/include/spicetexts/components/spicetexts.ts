/**
 * @module SpiceTextsModule
 */
import {Component, OnInit} from '@angular/core';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {backend} from "../../../services/backend.service";
import {relatedmodels} from "../../../services/relatedmodels.service";
import {session} from "../../../services/session.service";
import {metadata} from "../../../services/metadata.service";

@Component({
    templateUrl: './src/include/spicetexts/templates/spicetexts.html',
    providers: [relatedmodels]
})
export class SpiceTexts implements OnInit {

    public searchTerm: string = '';
    public languageFilter: string = 'all';

    constructor(private model: model,
                private language: language,
                private backend: backend,
                private session: session,
                private metadata: metadata,
                private relatedModels: relatedmodels) {
    }

    get moduleTexts() {
        return this.relatedModels.items
            .filter(item => {
                let textName = item.name.toLowerCase();
                let textDesc = item.description.toLowerCase();
                let term = this.searchTerm.toLowerCase();
                let sameTerm = (this.searchTerm.length == 0 || textName.includes(term) || textDesc.includes(term));
                let sameFilterLang = (this.languageFilter == item.text_language);
                return sameTerm && (this.languageFilter == 'all' || sameFilterLang);
            });
    }

    get sysLanguages() {
        return this.language.getAvialableLanguages();
    }

    public ngOnInit() {
        this.loadModuleTexts();
    }

    private loadModuleTexts() {
        this.relatedModels.id = this.model.id;
        this.relatedModels.module = this.model.module;
        this.relatedModels.loaditems = -1;
        this.relatedModels.relatedModule = 'SpiceTexts';
        this.relatedModels.getData();
    }

    private trackByFn(i, item) {
        return item.id;
    }
}
