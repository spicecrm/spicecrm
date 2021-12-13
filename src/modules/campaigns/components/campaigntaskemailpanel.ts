/**
 * @module ModuleCampaigns
 */
import {Component, Injector, OnDestroy, OnInit} from '@angular/core';
import {model} from '../../../services/model.service';
import {modal} from '../../../services/modal.service';
import {language} from '../../../services/language.service';
import {view} from "../../../services/view.service";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {backend} from "../../../services/backend.service";
import {metadata} from "../../../services/metadata.service";
import {Subscription} from "rxjs";

@Component({
    selector: 'campaign-task-email-panel',
    templateUrl: '../templates/campaigntaskemailpanel.html'
})
export class CampaignTaskEmailPanel implements OnInit, OnDestroy {
    /**
     * holds the component config set from the workbench
     */
    public componentconfig: any = {};
    /**
     * holds the active tab value
     */
    public activeTab: 'details' | 'preview' = 'details';
    /**
     * holds the email body html value
     */
    public emailBody: string;
    /**
     * holds the mailbox id value
     */
    public mailboxId: string;
    /**
     * holds the mailbox data
     */
    public mailboxData: {header: string, footer: string, stylesheet: string};
    /**
     * holds the sanitized html value
     */
    public sanitizedHTML: SafeHtml;
    /**
     * holds a subscription to be unsubscribed on destroy
     */
    public subscription = new Subscription();

    constructor(public language: language,
                public model: model,
                public injector: Injector,
                public view: view,
                public sanitizer: DomSanitizer,
                public backend: backend,
                public metadata: metadata,
                public modal: modal) {
    }

    /**
     * @return matchedModelState: boolean
     */
    get hidden() {
        return (this.componentconfig.requiredmodelstate && !this.model.checkModelState(this.componentconfig.requiredmodelstate));
    }

    /**
     * call to set the sanitized html value
     */
    public ngOnInit() {
        this.setInitialValues();
        this.setSanitizedHTMLValue();
        this.subscribeToModelChanges();
    }

    /**
     * unsubscribe from subscription
     */
    public ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    /**
     * build html dom from inputs
     * @param body
     * @param mailboxData
     */
    public buildHtmlDom(body: string, mailboxData: {header: string, footer: string, stylesheet: string}): string {
        return `<html lang="en">
                    <head>
                        <style>${mailboxData.stylesheet}</style>
                    </head>
                    <body>
                        <div>${mailboxData.header}</div>
                        <div>${body || ''}</div> 
                        <div>${mailboxData.footer}</div>
                    </body>
                </html>`;
    }

    /**
     * set the email body and the mailbox id to compare the changes from model
     */
    public setInitialValues() {
        this.emailBody = this.model.getField('email_body');
        this.mailboxId = this.model.getField('mailbox_id');
    }

    /**
     * subscribe to model changes to trigger rebuild the html dom
     */
    public subscribeToModelChanges() {
        this.subscription.add(
            this.model.data$.subscribe(res => {
                if (res.mailbox_id !== this.mailboxId) {
                    this.mailboxId = res.mailbox_id;
                    this.loadMailboxData();

                }
                if (res.email_body !== this.emailBody) {
                    this.emailBody = res.email_body;
                    this.setSanitizedHTMLValue();
                }
            })
        );
    }

    /**
     * open lookup modal to select an email template to be copied to the body
     */
    public copyFromTemplate() {
        this.modal.openModal('ObjectModalModuleLookup', true, this.injector)
            .subscribe(selectModal => {
                selectModal.instance.module = 'EmailTemplates';
                selectModal.instance.multiselect = false;
                selectModal.instance.selectedItems.subscribe(items => {
                    if (items.length) {
                        this.model.setField('email_subject', items[0].subject);
                        this.model.setField('email_body', items[0].body_html);
                        this.setSanitizedHTMLValue();
                    }
                });
            });
    }

    /**
     * set the activeTab
     */
    public setActiveTab(tab) {
        this.activeTab = tab;
    }

    /**
     * concatenate the mailbox html with the body with the stylesheet content and sanitize the html
     */
    public setSanitizedHTMLValue() {

        if (!this.mailboxId) {

            this.sanitizedHTML = this.sanitizer.bypassSecurityTrustHtml(this.emailBody || '');

        } else if (!!this.mailboxData) {

            const htmlDom: string = this.buildHtmlDom(this.emailBody, this.mailboxData);
            this.sanitizedHTML = this.sanitizer.bypassSecurityTrustHtml(htmlDom);

        }
    }

    /**
     * load the mailbox data for the preview dom
     * @private
     */
    public loadMailboxData() {

        if (!this.mailboxId) return;

        this.mailboxData = undefined;

        this.backend.get('Mailboxes', this.mailboxId, 'details').subscribe(
            (mailbox: any) => {
                if (!mailbox) return;
                this.mailboxData = {
                    header: mailbox.mailbox_header || '',
                    footer: mailbox.mailbox_footer || '',
                    stylesheet: this.metadata.getHtmlStylesheetCode(mailbox.stylesheet) || ''
                };
                this.setSanitizedHTMLValue();
            }
        );
    }
}
