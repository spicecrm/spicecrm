/**
 * @module ObjectFields
 */
import {ChangeDetectorRef, Component, Injector, OnInit} from '@angular/core';
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
import {configurationService} from "../../services/configuration.service";

declare var _;

@Component({
    selector: 'field-html',
    templateUrl: '../templates/fieldhtml.html',
})
export class fieldHtml extends fieldGeneric implements OnInit {
    /**
     * holds the selected signature id
     */
    public selectedSignatureId: string = '';
    /**
     * holds the available signatures
     */
    public signatures: { label: string, content: string, id: string }[] = [];
    /**
     * holds the spice page builder html code
     * @private
     */
    public parsedHtml: SafeHtml = '';
    /**
     * holds the sanitized value for the iframe
     * @private
     */
    public sanitizedValue: SafeHtml;
    /**
     * the cached full html code to prevent "flickering" of the iframe (change detection)
     */
    public fullValue_cached: string;
    /**
     * holds the full value for the iframe
     * @private
     */
    public fullValue: string = '';
    /**
     * holds the stylesheet field name
     * @private
     */
    public stylesheetField: string = '';
    /**
     * holds the stylesheet to be used in the iframe
     * @private
     */
    public stylesheetToUse: string = '';
    /**
     * holds a list of the saved stylesheets
     * @private
     */
    public stylesheets: any[];
    /**
     * when true use stylesheets in iframe
     * @private
     */
    public useStylesheets: boolean;

    public signaturePreviousPosition: number = -1;

    constructor(public model: model,
                public view: view,
                public language: language,
                public metadata: metadata,
                public backend: backend,
                public toast: toast,
                public router: Router,
                public injector: Injector,
                public broadcast: broadcast,
                public configurationService: configurationService,
                public modal: modal,
                public cdRef: ChangeDetectorRef,
                public sanitized: DomSanitizer) {
        super(model, view, language, metadata, router);
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
        if (!_.isEmpty(this.model.getField(this.stylesheetField))) {
            return this.model.getField(this.stylesheetField);
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

    /**
     * a getter for the value bound top the model
     */
    get value() {
        return this.model.getField(this.fieldname);
    }

    /**
     * a setter that returns the value to the model and triggers the validation
     *
     * @param val the new value
     */
    set value(val) {
        this.model.setField(this.fieldname, val);
        this.setHtmlValue();
    }

    /**
     * returns true if the field is to be displaxed truncated
     */
    get truncated() {
        return !!this.fieldconfig.truncate;
    }


    /**
     * call to load the initial values
     */
    public async ngOnInit() {
        this.setStylesheetField();
        this.setStylesheetsToUse();
        this.setHtmlValue();
        if (!!this.fieldconfig?.useSignature) {
            if (this.model.getField('mailbox_id')) {
                await this.loadMailboxSignature();
            }
            this.loadUserSignature();
        }
        this.modelChangesSubscriber();
    }

    /**
     * render the selected signature to the dom
     */
    public renderSelectedSignature() {

        this.clearSignature();

        if (!this.selectedSignatureId) return;

        if (!this.value) this.value = '';

        const signature = this.signatures.find(s => s.id == this.selectedSignatureId);
        const html = `<div data-signature="" style="margin: 10px 0">${signature.content}</div>`;

        if (this.signaturePreviousPosition > -1) {
            this.value = `${this.value.slice(0, this.signaturePreviousPosition)} ${html} ${this.value.slice(html.length + this.signaturePreviousPosition)}`;
        } else {
            this.value = `<p><br></p> ${html} ${this.value}`;
        }
    }

    /**
     * sets the edit mode on the view and the model into editmode itself
     */
    public setEditMode() {
        this.model.startEdit();
        this.view.setEditMode();
        this.cdRef.detectChanges();
    }

    public encodeHtml(value) {
        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    /**
     * load mailbox signature from backend or from cache and render the signature
     * push the signature option
     * @private
     */
    public loadMailboxSignature() {

        if (!this.isEditMode()) return;

        const mailboxId = this.model.getField('mailbox_id');
        if (!mailboxId) return;

        const signatureContent: string = this.configurationService.getData('mailbox_signature_' + mailboxId);
        if (!signatureContent) {
            return this.backend.get('Mailboxes', mailboxId).subscribe({
                next: (data: any) => {
                    if (!data.email_signature) return;
                    this.configurationService.setData('mailbox_signature_' + mailboxId, data.email_signature);
                    this.addSignature(mailboxId, data.email_signature, 'LBL_MAILBOX');
                    this.selectedSignatureId = mailboxId;
                    this.renderSelectedSignature();
                }
            });
        } else {
            this.addSignature(mailboxId, signatureContent, 'LBL_MAILBOX');
            this.selectedSignatureId = mailboxId;
            this.renderSelectedSignature();
        }
    }

    /**
     * push the signature data to the signature array
     * @private
     */
    public addSignature(id: string, content: string, label: string) {
        const existingSignature = this.signatures.find(s => s.id == id);
        if (!existingSignature) {
            this.signatures.push({id, content, label});
        } else {
            existingSignature.content = content;
        }
    }

    /**
     * load the user signatures from the backend
     * @private
     */
    public loadUserSignature() {

        if (!this.isEditMode()) return;

        const userSignatures = this.configurationService.getData('usersignature');
        if (!userSignatures) return;
        const noMailboxSignature = this.signatures.length == 0;
        this.addSignature('user', userSignatures, 'LBL_MY_SIGNATURE');

        // CRMDB-970 - disable loading user's signature on first load
        /* if (noMailboxSignature) {
            this.selectedSignatureId = 'user';
            this.renderSelectedSignature();
        }*/
    }

    /**
     * clear the signature from the body
     * @private
     */
    public clearSignature() {

        if (!this.value) return;

        const tempElement: HTMLElement = document.createElement('div');
        tempElement.innerHTML = this.value;

        Array.from(tempElement.querySelectorAll('div[data-signature]'))
            .forEach(el => {
                this.signaturePreviousPosition = tempElement.innerHTML.indexOf(el.outerHTML);
                el.parentNode.removeChild(el);
            });
        this.value = tempElement.innerHTML;
    }

    public setStylesheetField() {
        let fieldDefs = this.metadata.getFieldDefs(this.model.module, this.fieldname);
        if (!_.isEmpty(fieldDefs.stylesheet_id_field)) {
            this.stylesheetField = fieldDefs.stylesheet_id_field;
        }
    }

    public setStylesheetsToUse() {
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
    public setSanitizedValue() {
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

    public modelChangesSubscriber() {
        this.subscriptions.add(this.model.observeFieldChanges(this.fieldname).subscribe({
            next: (value) => {
                this.setHtmlValue();
            }
        }));
        this.subscriptions.add(this.model.observeFieldChanges('mailbox_id').subscribe({
            next: (mailboxId) => {
                if (this.fieldconfig?.useSignature && !!mailboxId && !this.signatures.some(s => s.id == mailboxId)) {
                    this.loadMailboxSignature();
                }
            }
        }));
    }

    public setHtmlValue() {
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

    public save(content) {
        let toSave = {
            date_modified: this.model.getField('date_modified'),
            [this.fieldname]: content
        };
        this.backend.save(this.model.module, this.model.id, toSave)
            .subscribe({
                next: (res: any) => {
                    this.model.endEdit();
                    this.model.setField('date_modified', res.date_modified, true);
                    this.value = res[this.fieldname];
                    this.model.startEdit();
                    this.toast.sendToast(this.language.getLabel("LBL_DATA_SAVED") + ".", "success");
                }, error: (error) => {
                    this.toast.sendToast(this.language.getLabel("LBL_ERROR") + " " + error.status, "error", error.error.error.message)
                }
            });
    }
}
