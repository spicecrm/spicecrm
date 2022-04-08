/**
 * @module ModuleGroupware
 */
import {Component, OnDestroy, OnInit, ChangeDetectorRef} from '@angular/core';
import {Router} from "@angular/router";
import {GroupwareService} from '../../../include/groupware/services/groupware.service';
import {broadcast} from "../../../services/broadcast.service";
import {Subscription} from "rxjs";

/**
 * Outlook add-in detail pane showing a list of beans that use the email addresses found in the email.
 * In case there is just one such bean, the details of it will be shown.
 */
@Component({
    selector: 'groupware-detail-pane',
    templateUrl: '../templates/groupwaredetailpane.html'
})
export class GroupwareDetailPane implements OnInit, OnDestroy {

    /**
     * boolean indicator that the component is loading
     */
    public loading: boolean = false;

    public subscriptions: Subscription = new Subscription();

    constructor(
        public groupware: GroupwareService,
        public router: Router,
        public broadcast: broadcast,
        public cdref: ChangeDetectorRef
    ) {
    }

    /**
     * triggers the loader and if one record is found opens that one
     */
    public ngOnInit(): void {
        this.loadRecords();

        this.subscriptions.add(
            this.broadcast.message$.subscribe(message => {
                this.handleMessage(message);
            })
        );

    }

    /**
     * unsubscribe from teh broadcast
     */
    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    /**
     * handle the broadcast message
     *
     * @param message
     */
    public handleMessage(message) {
        switch (message.messagetype) {
            case 'groupware.itemchanged':
                this.loadRecords();
                break;
        }
    }

    /**
     * loads records for the email addresses found in the item
     */
    public loadRecords() {
        this.loading = true;

        this.groupware.loadLinkedBeans().subscribe(
            (res) => {
                if (res.length == 1) {
                    this.router.navigate(["/groupware/details/" + res[0].module + '/' + res[0].id]);
                }
                this.loading = false;
                this.cdref.detectChanges();
            },
            (err) => {
                // todo logger service
                this.loading = false;
            }
        );
    }

    /**
     * handles the select when the user clicks a record
     *
     * @param bean
     */
    public selectBean(bean) {
        // this.loadRecord(bean.module, bean.id);
        this.router.navigate(["/groupware/details/" + bean.module + '/' + bean.id]);
    }

}
