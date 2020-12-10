/**
 * @module ObjectFields
 */
import {ChangeDetectorRef, Component, Injector} from '@angular/core';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {fieldGeneric} from './fieldgeneric';
import {Router} from '@angular/router';
import {broadcast} from "../../services/broadcast.service";
import {backend} from "../../services/backend.service";
import {toast} from "../../services/toast.service";
import {modal} from "../../services/modal.service";

declare var _;

@Component({
    selector: 'field-richtext',
    templateUrl: './src/objectfields/templates/fieldrichtext.html',
})
export class fieldRichText extends fieldGeneric {
    /**
     * holds the spice page builder html code
     * @private
     */
    private parsedHtml: SafeHtml = '';
    /**
     * holds the sanitized value for the iframe
     * @private
     */
    private sanitizedValue: SafeHtml;
    /**
     * the cached full html code to prevent "flickering" of the iframe (change detection)
     */
    private fullValue_cached: string;
    /**
     * holds the full value for the iframe
     * @private
     */
    private fullValue: string = '';
    /**
     * holds the stylesheet field name
     * @private
     */
    private stylesheetField: string = '';
    /**
     * holds the stylesheet to be used in the iframe
     * @private
     */
    private stylesheetToUse: string = '';
    /**
     * holds a list of the saved stylesheets
     * @private
     */
    private stylesheets: any[];
    /**
     * when true use stylesheets in iframe
     * @private
     */
    private useStylesheets: boolean;

    constructor(public model: model,
                public view: view,
                public language: language,
                public metadata: metadata,
                public backend: backend,
                public toast: toast,
                public router: Router,
                public injector: Injector,
                public broadcast: broadcast,
                public modal: modal,
                public cdRef: ChangeDetectorRef,
                public sanitized: DomSanitizer) {
        super(model, view, language, metadata, router);
        this.modelChangesSubscriber();
        this.stylesheets = this.metadata.getHtmlStylesheetNames();
    }

    get heightStyle() {
        return {height: this.fieldconfig.height ? this.fieldconfig.height : '500px'};
    }

    /**
     * returns the style for the given stylesheet
     * used in the iframe display
     */
    get styleTag() {
        return (this.stylesheetId) ? '<style>' + this.metadata.getHtmlStylesheetCode(this.stylesheetId) + '</style>' : '';
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
     * @param id
     */
    set stylesheetId(id: string) {
        if (id) {
            this.model.setField(this.stylesheetField, id);
        }
    }

    public ngOnInit() {
        this.setStylesheetField();
        this.setStylesheetsToUse();
        this.setHtmlValue();
    }

    /**
     * sets the edit mode on the view and the model into editmode itself
     */
    public setEditMode() {
        this.model.startEdit();
        this.view.setEditMode();
        this.cdRef.detectChanges();
    }

    protected encodeHtml(value) {
        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
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
    }

    /**
     * get the html representation of the corresponding value
     * SPICEUI-88 - to prevent "flickering" of the iframe displaying this value, the value will be cached and should only be rebuild on change
     * @returns {any}
     */
    private setSanitizedValue() {
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
            this.sanitizedValue = this.sanitized.bypassSecurityTrustResourceUrl(this.fullValue ? 'data:text/html;charset=UTF-8,' + encodeURIComponent(this.fullValue) : '');
            this.fullValue_cached = this.fullValue;
        }
        return this.sanitizedValue;
    }

    private modelChangesSubscriber() {
        this.subscriptions.add(this.model.data$.subscribe(() => this.setHtmlValue()));
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
        this.parsedHtml = this.sanitized.bypassSecurityTrustHtml(this.value);
        this.setSanitizedValue();
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
