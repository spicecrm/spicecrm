/*
SpiceUI 2021.01.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

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
                        <div>${mailboxData.header}</div>
                        <div>${body || ''}</div> 
                        <div>${mailboxData.footer}</div>
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
    private loadMailboxData() {

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
