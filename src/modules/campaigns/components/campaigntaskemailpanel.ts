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
    templateUrl: './src/modules/campaigns/templates/campaigntaskemailpanel.html'
})
export class CampaignTaskEmailPanel implements OnInit, OnDestroy {
    /**
     * holds the component config set from the workbench
     */
    private componentconfig: any = {};
    /**
     * holds the active tab value
     */
    private activeTab: 'details' | 'preview' = 'details';
    /**
     * holds the email body html value
     */
    private emailBody: string;
    /**
     * holds the mailbox id value
     */
    private mailboxId: string;
    /**
     * holds the mailbox data
     */
    private mailboxData: {header: string, footer: string, stylesheet: string};
    /**
     * holds the mailbox data
     */
    private loadingMailboxData: boolean = false;
    /**
     * holds the sanitized html value
     */
    private sanitizedHTML: SafeHtml;
    /**
     * holds a subscription to be unsubscribed on destroy
     */
    private subscription = new Subscription();

    constructor(private language: language,
                private model: model,
                private injector: Injector,
                private view: view,
                private sanitizer: DomSanitizer,
                private backend: backend,
                private metadata: metadata,
                private modal: modal) {
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
    protected buildHtmlDom(body: string, mailboxData: {header: string, footer: string, stylesheet: string}): string {
        return `<html lang="en">
                    <head>
                        <style>${mailboxData.stylesheet}</style>
                    </head>
                    <body>
                        <header>${mailboxData.header}</header>
                         ${body}
                        <footer>${mailboxData.footer}</footer>
                    </body>
                </html>`;
    }

    /**
     * set the email body and the mailbox id to compare the changes from model
     */
    private setInitialValues() {
        this.emailBody = this.model.getField('email_body');
        this.mailboxId = this.model.getField('mailbox_id');
    }

    /**
     * subscribe to model changes to trigger rebuild the html dom
     */
    private subscribeToModelChanges() {
        this.subscription.add(
            this.model.data$.subscribe(res => {
                if (res.mailbox_id !== this.mailboxId) {
                    this.mailboxData = undefined;
                    this.setSanitizedHTMLValue();

                }
                if (res.email_body !== this.emailBody) {
                    this.setInitialValues();
                    this.setSanitizedHTMLValue();
                }
            })
        );
    }

    /**
     * open lookup modal to select an email template to be copied to the body
     */
    private copyFromTemplate() {
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
    private setActiveTab(tab) {
        this.activeTab = tab;
    }

    /**
     * concatenate the mailbox html with the body with the stylesheet content and sanitize the html
     */
    private setSanitizedHTMLValue() {
        const mailboxId = this.model.getField('mailbox_id');
        const emailBody: string = this.model.getField('email_body') || '';

        if (!mailboxId) {
            this.sanitizedHTML = this.sanitizer.bypassSecurityTrustHtml(
                emailBody
            );
        } else if (!!this.mailboxData) {
            const htmlDom: string = this.buildHtmlDom(
                emailBody,
                this.mailboxData
            );
            this.sanitizedHTML = this.sanitizer.bypassSecurityTrustHtml(
                htmlDom
            );
        } else if (!this.mailboxData && !this.loadingMailboxData) {
            this.loadingMailboxData = true;
            this.backend.get('Mailboxes', this.model.getField('mailbox_id'), 'details').subscribe(
                (mailbox: any) => {
                    this.loadingMailboxData = false;
                    if (!mailbox) return;
                    const mailboxData = {
                        header: mailbox.mailbox_header || '',
                        footer: mailbox.mailbox_footer || '',
                        stylesheet: this.metadata.getHtmlStylesheetCode(mailbox.stylesheet) || ''
                    };
                    this.mailboxData = mailboxData;

                    const htmlDom: string = this.buildHtmlDom(
                        emailBody,
                        mailboxData
                    );
                    this.sanitizedHTML = this.sanitizer.bypassSecurityTrustHtml(
                        htmlDom
                    );
                }
            );
        }
    }
}
