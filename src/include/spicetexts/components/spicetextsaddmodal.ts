/**
 * @module SpiceTextsModule
 */
import {Component, OnInit} from '@angular/core';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {Subject} from "rxjs";
import {view} from "../../../services/view.service";
import {backend} from "../../../services/backend.service";
import {configurationService} from "../../../services/configuration.service";

declare var _;

@Component({
    templateUrl: '../templates/spicetextsaddmodal.html',
    providers: [model, view]
})

export class SpiceTextsAddModal implements OnInit {

    public spiceTexts: any[] = [];
    public sysTextIds: any[] = [];
    public parent: any = {};
    public response: any = new Subject<any>();
    public self: any = {};
    public saveTriggered: boolean = false;
    public loading: string = '';

    constructor(public model: model,
                public configurationService: configurationService,
                public view: view,
                public backend: backend,
                public language: language) {
        this.model.module = 'SpiceTexts';
    }

    get textId() {
        return this.model.getField('text_id');
    }

    set textId(val) {
        this.model.setField('text_id', val);
        this.model.resetFieldMessages('text_id', 'error', 'validation');
        this.loading = 'text_language';
        window.setTimeout(() => this.loading = '', 500);
    }

    get textLanguage() {
        return this.model.getField('text_language');
    }

    set textLanguage(val) {
        this.model.setField('text_language', val);
        this.model.resetFieldMessages('text_language', 'error', 'validation');
        this.loading = 'text_id';
        window.setTimeout(() => this.loading = '', 500);
    }

    get availableSysLanguages() {
        return this.language.getAvialableLanguages().filter(lang => {
            let groupedTexts = _.groupBy(this.spiceTexts, 'text_id');
            let found = 0;
            for (let prop in groupedTexts) {
                if (groupedTexts.hasOwnProperty(prop)) {
                    let translated = groupedTexts[prop].find(txt => txt.text_language == lang.language);
                    found += translated ? 1 : 0;
                }
            }
            let currentTextTranslated = this.spiceTexts
                .find(txt => txt.text_id == this.textId && txt.text_language == lang.language);
            return (found < this.sysTextIds.length) && !currentTextTranslated;
        });
    }

    get availableSysTexts() {
        return this.sysTextIds.filter(sysText => {
            let found = this.spiceTexts.filter(txt => txt.text_id == sysText.text_id);
            let currentTextTranslated = this.spiceTexts
                .find(txt => txt.text_id == sysText.text_id && txt.text_language == this.textLanguage);
            return (found.length < this.language.getAvialableLanguages().length) && !currentTextTranslated;
        });
    }

    get isDisabledText() {
        return (!this.availableSysTexts || this.availableSysTexts.length == 0) || this.loading == 'text_id';
    }

    get isDisabledLang() {
        return (!this.availableSysLanguages || this.availableSysLanguages.length == 0) || this.loading == 'text_language';
    }

    public ngOnInit() {
        this.initializeModel();
        this.view.isEditable = true;
        this.view.setEditMode();
    }

    public getFieldStyle(field) {
        return this.model.getFieldMessages(field, 'error') ? 'slds-has-error' : '';
    }

    public initializeModel() {
        this.model.initialize();
        this.model.setFields({
            parent_id : this.parent.id,
            parent_type: this.parent.module
        })

    }

    public trackByFn(index, item) {
        return item.id;
    }

    public isLoading(field) {
        return this.loading == field;
    }

    public save() {
        this.saveTriggered = true;
        if (!this.model.validate()) {
            return this.saveTriggered = false;
        }
        let nameValue = this.model.getField('description').slice(0, 100);
        this.model.setField('name', nameValue);

        this.model.save(true).subscribe(
            data => {
                this.response.next(data);
                this.response.complete();
                this.self.destroy();
            },
            err => {
                this.cancel();
            });
        this.saveTriggered = false;
    }

    public cancel() {
        this.response.next(false);
        this.response.complete();
        this.self.destroy();
    }
}
