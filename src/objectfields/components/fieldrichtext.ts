/**
 * @module ObjectFields
 */
import {Component, OnDestroy, ViewChild, ViewContainerRef} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {fieldGeneric} from './fieldgeneric';
import {Router} from '@angular/router';
import {broadcast} from "../../services/broadcast.service";
import {backend} from "../../services/backend.service";
import {toast} from "../../services/toast.service";

declare var _;

@Component({
    selector: 'field-richtext',
    templateUrl: './src/objectfields/templates/fieldrichtext.html',
})
export class fieldRichText extends fieldGeneric {
    private stylesheetField: string = '';
    private useStylesheets: boolean;
    private useStylesheetSwitcher: boolean;
    private stylesheets: any[];
    private stylesheetToUse: string = '';

    /**
     *
     */
    private _sanitizedValue;

    /**
     * the cached full html code to prevent "flickering" of the iframe (change detection)
     */
    private fullValue_cached: string;


    private fullValue: string = '';

    @ViewChild('printframe', {read: ViewContainerRef, static: true}) private printframe: ViewContainerRef;

    constructor(public model: model,
                public view: view,
                public language: language,
                public metadata: metadata,
                public backend: backend,
                public toast: toast,
                public router: Router,
                public broadcast: broadcast,
                public sanitized: DomSanitizer) {
        super(model, view, language, metadata, router);
        this.stylesheets = this.metadata.getHtmlStylesheetNames();
        this.modelChangesSubscriber();
    }

    /**
     * get the html representation of the corresponding value
     * SPICEUI-88 - to prevent "flickering" of the iframe displaying this value, the value will be cached and should be rebuild on change
     * @returns {any}
     */
    get htmlValue() {
        return this.sanitized.bypassSecurityTrustHtml(this.value);
    }

    /**
     * getter for the stylesheet id from the fiels
     */
    get stylesheetId(): string {
        if (!_.isEmpty(this.model.data[this.stylesheetField])) {
            return this.model.data[this.stylesheetField];
        }
        return this.stylesheetId = this.stylesheetToUse;
    }

    /**
     * setter for the stylesheet id
     *
     * @param id
     */
    set stylesheetId(id: string) {
        if (id) {
            this.model.setField(this.stylesheetField, id);
        }
    }

    /**
     * simple getter to return if the editor mode shoudl be simple or extended
     */
    get extendedmode() {
        return this.fieldconfig.simplemode ? false : true;
    }

    /**
     * returns the style for the given stylesheet
     * used in the iframe display
     */
    get styleTag() {
        return (this.stylesheetId) ? '<style>' + this.metadata.getHtmlStylesheetCode(this.stylesheetId) + '</style>' : '';
    }

    /**
     * simple getter to get the config if the field shoudl be rendered as iFrame in the view
     */
    get asiframe() {
        return this.fieldconfig.asiframe ? true : false;
    }

    get heightStyle() {
        return {height: this.fieldconfig.height ? this.fieldconfig.height : '500px'};
    }

    public ngOnInit() {
        this.setStylesheetField();
        this.setStylesheetsToUse();
        this.setHtmlValue();
    }


    /**
     * get the html representation of the corresponding value
     * SPICEUI-88 - to prevent "flickering" of the iframe displaying this value, the value will be cached and should only be rebuild on change
     * @returns {any}
     */
    get sanitizedValue() {
        if (this.value) {
            if (this.value.includes('</html>')) {
                this.fullValue = this.value;
            } else {
                // added <base target="_blank"> so all links open in new window
                this.fullValue = `<html><head><base target="_blank">${this.styleTag}</head><body class="spice">${this.value}</body></html>`;
            }
        }

        // if value changed, generate sanitized html value
        if (this.fullValue != this.fullValue_cached) {
            this._sanitizedValue = this.sanitized.bypassSecurityTrustResourceUrl(this.fullValue ? 'data:text/html;charset=UTF-8,' + encodeURIComponent(this.fullValue) : '');
            this.fullValue_cached = this.fullValue;
        }
        return this._sanitizedValue;
    }

    private modelChangesSubscriber() {

        this.subscriptions.add(this.model.saved$.subscribe(saved => this.setHtmlValue()));
        this.subscriptions.add(this.model.data$.subscribe(saved => this.setHtmlValue()));

        /*
        this.broadcast.message$.subscribe(msg => {
            switch (msg.messagetype) {
                case 'model.save':
                case 'model.loaded':
                    this.setHtmlValue();
            }
        });
        */
    }

    private setStylesheetField() {
        let fieldDefs = this.metadata.getFieldDefs(this.model.module, this.fieldname);
        if (!_.isEmpty(fieldDefs.stylesheet_id_field)) {
            this.stylesheetField = fieldDefs.stylesheet_id_field;
        }
    }

    private setStylesheetsToUse() {
        this.useStylesheets = !_.isEmpty(this.stylesheetField) && !_.isEmpty(this.stylesheets);
        if (this.useStylesheets) {
            if (this.stylesheets.length === 1) {
                this.stylesheetToUse = this.stylesheets[0].id;
            } else if (!_.isEmpty(this.fieldconfig.stylesheetId)) {
                this.stylesheetToUse = this.fieldconfig.stylesheetId;
            } else {
                this.stylesheetToUse = this.metadata.getHtmlStylesheetToUse(this.model.module, this.fieldname);
            }
        }
        this.useStylesheetSwitcher = this.useStylesheets && _.isEmpty(this.stylesheetToUse);
    }

    private setHtmlValue() {
        let regexp = /<code>[\s\S]*?<\/code>/g;
        let match = regexp.exec(this.value);
        while (match != null) {
            this.value = this.value
                .replace(match, this.encodeHtml(match))
                .replace('&lt;code&gt;', '<code>')
                .replace('&lt;/code&gt;', '</code>');
            match = regexp.exec(this.value);
        }
    }

    private encodeHtml(value) {
        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    private updateStylesheet(stylesheetId) {
        if (!_.isEmpty(this.stylesheetField) && _.isString(stylesheetId)) {
            this.model.setField(this.stylesheetField, stylesheetId);
        }
    }

    private save(content) {
        let toSave = {
            date_modified: this.model.data.date_modified,
            [this.fieldname]: content
        };
        this.backend.save(this.model.module, this.model.id, toSave)
            .subscribe(
                (res: any) => {
                    this.model.endEdit();
                    this.model.data.date_modified = res.date_modified;
                    this.value = res[this.fieldname];
                    this.model.startEdit();
                    this.toast.sendToast(this.language.getLabel("LBL_DATA_SAVED") + ".", "success");
                },
                error => this.toast.sendToast(this.language.getLabel("LBL_ERROR") + " " + error.status, "error", error.error.error.message)
            );
    }
}
