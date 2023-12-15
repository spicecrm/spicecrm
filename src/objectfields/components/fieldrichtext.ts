/**
 * @module ObjectFields
 */
import {ChangeDetectorRef, Component, Injector, OnInit} from '@angular/core';
import {DomSanitizer, SafeHtml, SafeResourceUrl} from '@angular/platform-browser';
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
import {lastValueFrom} from "rxjs";

declare var _;

@Component({
    selector: 'field-richtext',
    templateUrl: '../templates/fieldrichtext.html',
})
export class fieldRichText extends fieldGeneric implements OnInit {
    /**
     * holds the selected signature id
     */
    public selectedSignatureId: string = '';
    /**
     * holds the available signatures
     */
    public signatures: { label: string, content: string, id: string }[] = [];
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

    public signaturePosition: number = -1;
    /**
     * holds the iframe blob url
     */
    public iframeUrl: SafeResourceUrl;
    /**
     * loading boolean for the iframe blob
     */
    public isLoading: boolean = false;

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

    private _styleTag = '';

    /**
     * returns the style for the given stylesheet
     * used in the iframe display
     */
    get styleTag() {
        return this._styleTag;
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
    }

    /**
     * call to load the initial values
     */
    public ngOnInit() {

        if (this.fieldconfig.iframe_as_blob_url) {

            this.isLoading = true;
            this.model.generateFieldHtmlContentBlobUrl(this.fieldname).subscribe((blob: SafeResourceUrl) => {
                this.isLoading = false;
                this.iframeUrl = blob;
                this.cdRef.detectChanges();
            });
        }

        this.setStylesheetField();
        this.setStylesheetsToUse();
        this.setHtmlValue();
        this.modelChangesSubscriber();
        if (!!this.fieldconfig?.useSignature) {
            this.addSignature('mailbox', '', 'LBL_MAILBOX_SIGNATURE');
            this.selectedSignatureId = this.model.getFieldValue("signature");
            this.loadUserSignature(this.selectedSignatureId == 'user');
            this.loadMailboxSignature(this.model.getField('mailbox_id'), this.selectedSignatureId == 'mailbox');
        }
    }

    /**
     * signature changed (if mailbox -> load signature)
     */
    public changeSignature() {
        if(this.selectedSignatureId == 'mailbox') {
            this.loadMailboxSignature(this.model.getField('mailbox_id'), true);
        }
        this.renderSelectedSignature();
    }

    /**
     * render the selected signature to the dom
     */
    public renderSelectedSignature() {

        if (!this.value) this.value = '';

        const tempElement: HTMLElement = document.createElement('div');
        tempElement.innerHTML = this.value;

        let selectedEleSign = tempElement.querySelectorAll("div[data-signature]");
        let selectedEleReply = tempElement.querySelectorAll("div[data-spice-reply-quote]");


        // keep text till signature or reply (find index position)
        this.signaturePosition = tempElement.innerHTML.indexOf(selectedEleReply[0]?.outerHTML);
        if(selectedEleSign.length > 0) {
            this.signaturePosition = tempElement.innerHTML.indexOf(selectedEleSign[0]?.outerHTML);
        }

        // remove signature from value
        selectedEleSign[0]?.parentNode.removeChild(selectedEleSign[0]);
        this.value = tempElement.innerHTML;

        // set signature to non-db field (keep it after expanding)
        this.model.setField("signature", this.selectedSignatureId);

        if (!this.selectedSignatureId) return;

        const signature = this.signatures.find(s => s.id == this.selectedSignatureId);
        const html = `<div data-signature="" class="data-signature" style="margin: 10px 0">${signature.content}</div>`;

        this.value = [
            this.value.slice(0, this.signaturePosition),
            html,
            selectedEleReply[0]?.outerHTML
        ].join('<p><br></p>');
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
    public loadMailboxSignature(mailboxId, render): Promise<any> | void {

        if (!this.isEditMode()) return;

        if (!mailboxId) return;

        const signatureContent: string = this.configurationService.getData('mailbox_signature_' + mailboxId);
        if (!signatureContent) {
            return lastValueFrom(this.backend.get('Mailboxes', mailboxId))
                .then((data: any) => {
                    // if (!data.email_signature) return;
                    this.configurationService.setData('mailbox_signature_' + mailboxId, data.email_signature);

                    this.addSignature('mailbox', data.email_signature, 'LBL_MAILBOX_SIGNATURE');

                    if(render) {
                        this.renderSelectedSignature();
                    }
                });
        } else {
            this.addSignature('mailbox', signatureContent, 'LBL_MAILBOX');

            if(render) {
                this.renderSelectedSignature();
            }
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
    public loadUserSignature(render) {

        if (!this.isEditMode()) return;

        const userSignatures = this.configurationService.getData('usersignature');
        if (!userSignatures) return;
        const noMailboxSignature = this.signatures.length == 0;
        this.addSignature('user', userSignatures, 'LBL_MY_SIGNATURE');

        if(render) {
            this.renderSelectedSignature();
        }
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
                this.fullValue = `<html><head><base target="_blank"><style>${this.styleTag}</style></head><body class="spice">${this.value}</body></html>`;
            }
        }

        // if value changed, generate sanitized html value
        if (this.fullValue != this.fullValue_cached) {
            this.sanitizedValue = this.sanitized.bypassSecurityTrustResourceUrl(this.fullValue ? 'data:text/html;charset=UTF-8,' + encodeURIComponent(this.fullValue) : '');
            this.fullValue_cached = this.fullValue;
        }
    }

    public modelChangesSubscriber() {
        this.subscriptions.add(this.model.observeFieldChanges(this.fieldname).subscribe({
            next: () => this.setHtmlValue()
        }));
        this.subscriptions.add(this.model.observeFieldChanges('mailbox_id').subscribe(mailboxId => {
            if (this.fieldconfig?.useSignature && !!mailboxId && this.model.getField('signature') == 'mailbox') {
                this.loadMailboxSignature(mailboxId, true);
            }
        }));
    }

    /**
     * search the html content for style and split, then set this.value
     */
    public setHtmlValue() {

        if (!this.value?.includes('</html>') && !this.fieldconfig.iframe_as_blob_url) {
            return this.setSanitizedValue();
        }

        let styleContent = !!this.stylesheetId ? this.metadata.getHtmlStylesheetCode(this.stylesheetId) : '';

        const element = document.createElement('div');
        element.innerHTML = (typeof this.value === 'undefined' ? '' : this.value);
        const styleTag = element.getElementsByTagName('style')[0];
        styleContent += styleTag?.innerHTML ?? '';
        styleTag?.remove();

        this.model.setField(this.fieldname, element.innerHTML, true);
        this._styleTag = styleContent;

        if (!this.fieldconfig.iframe_as_blob_url) {
            this.setSanitizedValue();
        }
    }

    public save(content) {
        let toSave = {
            date_modified: this.model.getField('date_modified'),
            [this.fieldname]: content
        };
        this.backend.save(this.model.module, this.model.id, toSave)
            .subscribe({
                next: (res: any) => {
                    this.model.setField('date_modified', res.date_modified, true);
                    this.value = res[this.fieldname];
                    this.toast.sendToast(this.language.getLabel("LBL_DATA_SAVED") + ".", "success");
                }, error: (error) => {
                    this.toast.sendToast(this.language.getLabel("LBL_ERROR") + " " + error.status, "error", error.error.error.message)
                }
            });
    }
}
