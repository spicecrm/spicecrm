/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

/**
 * @module ModuleMailboxes
 */
import {Component, OnDestroy, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';
import {Router} from '@angular/router';

@Component({
    selector: 'dashboard-mailboxes-dashlet',
    templateUrl: './src/modules/mailboxes/templates/mailboxesdashlet.html',
    providers: [model, view]
})
export class MailboxesDashlet implements OnInit, OnDestroy {
    private isLoading: boolean = false;
    private mailboxes: any[] = [];
    private canLoadMore: boolean = true;
    private loadLimit: number = 20;
    private getMailBoxesInterval: any = undefined;

    @ViewChild('tablecontainer', {read: ViewContainerRef, static: true}) private tablecontainer: ViewContainerRef;

    constructor(private language: language,
                private backend: backend,
                private model: model,
                private router: Router) {

    }

    /*
    * @set model.module
    * @getMailboxes
    * @set getMailBoxesInterval
    */
    public ngOnInit() {
        this.model.module = 'Mailboxes';
        this.getMailboxes();
        this.getMailBoxesInterval = this.getMailboxesInterval();
    }

    /*
    * @clearInterval for getMailBoxesInterval
    */
    public ngOnDestroy() {
        if (this.getMailBoxesInterval) {
            window.clearInterval(this.getMailBoxesInterval);
        }
    }

    /*
    * A function that defines how to track changes for items in the iterable (ngForOf).
    * https://angular.io/api/common/NgForOf#properties
    * @param index
    * @param item
    * @return index
    */
    private trackByFn(index, item) {
        return item.id;
    }

    /*
    * @param refresh?: boolean
    * @set isLoading
    * @getRequest mailboxes
    * @map mailboxes set emailsread
    * @set mailboxes
    * @reset emailsread if refresh is false
    * @reset emailsunread if refresh is false
    * @set canLoadMore to false if all records retrieved
    */
    private getMailboxes(refresh?) {
        this.isLoading = true;
        this.backend.getRequest('modules/Mailboxes/dashlet').subscribe((mailboxes: any[]) => {
            if (!mailboxes || mailboxes.length == 0) {
                return this.isLoading = false;
            }
            mailboxes.map(mailbox => mailbox.emailsread = mailbox.emailsread - mailbox.emailsclosed);

            if (!refresh) {
                this.mailboxes = mailboxes;
            } else {
                this.mailboxes.every(mailbox => {
                    mailboxes.some(responseMailbox => {
                        if (responseMailbox.id == mailbox.id) {
                            mailbox.emailsread = responseMailbox.emailsread;
                            mailbox.emailsunread = responseMailbox.emailsunread;
                            return true;
                        }
                    });
                    return true;
                });
            }
            if (mailboxes.length < this.loadLimit) {
                this.canLoadMore = false;
            }
            this.isLoading = false;
        });
    }

    /*
    * @setInterval to 1 minute
    * @getMailboxes on interval
    * @return interval
    */
    private getMailboxesInterval() {
        return window.setInterval(() => this.getMailboxes(true), 60000);
    }

    /*
    * @loadMore if the scroll position overflowed the scrollHeight
    */
    private onScroll() {
        let element = this.tablecontainer.element.nativeElement;
        if (element.scrollTop + element.clientHeight >= element.scrollHeight) {
            this.loadMore();
        }
    }

    /*
    * @navigate to record
    */
    private goToRecord(id) {
        this.router.navigate([`/module/${this.model.module}/${id}`]);

    }

    /*
    * @set isLoading
    * @getRequest mailboxes
    * @set mailboxes
    * @set canLoadMore
    */
    private loadMore() {
        if (this.canLoadMore) {
            this.isLoading = true;
            this.backend.getRequest('modules/Mailboxes/dashlet').subscribe((mailboxes: any[]) => {
                this.mailboxes = this.mailboxes.concat(mailboxes);
                if (mailboxes.length < this.loadLimit) {
                    this.canLoadMore = false;
                }
                this.isLoading = false;
            });
        }
    }
}
