import {Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';
import {Router} from '@angular/router';

@Component({
    selector: 'dashboard-mailboxes-dashlet',
    templateUrl: './src/modules/mailboxes/templates/mailboxesdashlet.html',
    providers: [model, view]
})
export class MailboxesDashlet implements OnInit, OnDestroy {
    private isLoading: boolean = true;
    private mailboxes: Array<any> = [];
    private canLoadMore: boolean = true;
    private loadLimit: number = 20;
    private getMailBoxesInterval: any = undefined;

    @ViewChild('tablecontainer', {read: ViewContainerRef}) private tablecontainer: ViewContainerRef;
    @ViewChild('headercontainer', {read: ViewContainerRef}) private headercontainer: ViewContainerRef;

    constructor(private language: language,
                private metadata: metadata,
                private backend: backend,
                private model: model,
                private router: Router,
                private elementRef: ElementRef) {

    }

    get tablestyle() {
        let element = this.headercontainer.element.nativeElement;
        return {height: `calc(98% - ${element.clientHeight}px`};

    }

    public ngOnInit() {
        this.model.module = 'Mailboxes';
        this.getMailboxes();
        this.getMailBoxesInterval = this.getMailboxesInterval();
    }

    public ngOnDestroy() {
        if (this.getMailBoxesInterval) {
            clearInterval(this.getMailBoxesInterval);
        }
    }

    private getMailboxes() {
            this.backend.getRequest('/modules/Mailboxes/dashlet').subscribe((mailboxes: any[]) => {
                this.mailboxes = mailboxes;
                if (mailboxes.length < this.loadLimit) {
                    this.canLoadMore = false;
                }
                this.isLoading = false;
            });
            if (this.mailboxes.length > 0) {
                this.mailboxes = this.mailboxes.map(mailbox => mailbox.emailsread = mailbox.emailsread - mailbox.emailsclosed);
            }
    }

    private getMailboxesInterval() {
         return setInterval(() => this.getMailboxes(), 60000);
    }

    private onScroll() {
        let element = this.tablecontainer.element.nativeElement;
        if (element.scrollTop + element.clientHeight >= element.scrollHeight) {
            this.loadMore();
        }
    }

    private goToRecord(id) {
        this.router.navigate([`/module/${this.model.module}/${id}`]);

    }

    private loadMore() {
        if (this.canLoadMore) {
            this.isLoading = true;
            this.backend.getRequest('/modules/Mailboxes/dashlet').subscribe((mailboxes: any[]) => {
                this.mailboxes = this.mailboxes.concat(mailboxes);
                if (mailboxes.length < this.loadLimit) {
                    this.canLoadMore = false;
                }
                this.isLoading = false;
            });
        }
    }
}
