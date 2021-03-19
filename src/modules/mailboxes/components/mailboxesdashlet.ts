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
        this.backend.getRequest('module/Mailboxes/dashlet').subscribe((mailboxes: any[]) => {
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
            this.backend.getRequest('module/Mailboxes/dashlet').subscribe((mailboxes: any[]) => {
                this.mailboxes = this.mailboxes.concat(mailboxes);
                if (mailboxes.length < this.loadLimit) {
                    this.canLoadMore = false;
                }
                this.isLoading = false;
            });
        }
    }
}
