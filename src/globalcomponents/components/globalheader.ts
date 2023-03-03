/**
 * @module GlobalComponents
 */
import {
    AfterViewInit,
    ChangeDetectorRef,
    Component, OnDestroy,
    ViewChild, ViewContainerRef
} from '@angular/core';
import {toast} from '../../services/toast.service';
import {session} from '../../services/session.service';
import {navigation} from '../../services/navigation.service';
import {layout} from '../../services/layout.service';
import {ActivationStart, Router} from '@angular/router';
import {configurationService} from '../../services/configuration.service';
import {Subscription} from "rxjs";
import {backend} from "../../services/backend.service";
import {userpreferences} from "../../services/userpreferences.service";

declare var _: any;

/**
 * renders the global header bar
 * a central component on teh spiceui
 */
@Component({
    selector: 'global-header',
    templateUrl: '../templates/globalheader.html'
})
export class GlobalHeader implements OnDestroy, AfterViewInit {

    /**
     * holds the rxjs subscriptions to unsubscribe
     */
    public subscriptions: Subscription = new Subscription();
    /**
     * holds the pending requests total count
     */
    public pendingRequestsTotal = 0;
    /**
     * holds the progress bar width in percent
     */
    public progressWidth = 0;

    /**
     * reference to the header to get the height
     */
    @ViewChild('header', {read: ViewContainerRef, static: false})public header: ViewContainerRef;

    constructor(public session: session,
                public router: Router,
                public toast: toast,
                public layout: layout,
                public userPreferences: userpreferences,
                public navigation: navigation,
                public backend: backend,
                public cdRef: ChangeDetectorRef,
                public configurationService: configurationService) {

        // ToDo: check what this is doing here
        this.router.events.subscribe((val: any) => {
            if (val instanceof ActivationStart) {
                // CR1000463: use spiceacl to enable listing and access foreign user records
                // keep BWC for old modules/ACL/ACLController.php
                let _aclcontroller = this.configurationService.getSystemParamater('aclcontroller');
                if (_aclcontroller && _aclcontroller != 'spiceacl' && val.snapshot.params.module === 'Users' && val.snapshot.params.id) {
                    if (!this.session.authData.admin && val.snapshot.params.id != this.session.authData.userId) {
                        this.toast.sendToast('You are not allowed to view or edit foreign user data.', 'warning', null, 3);
                        this.router.navigate(['/module/Users']);
                    }
                }
            }
        });

    }

    /**
     * a getter for the header height
     */
    get headerHeight() {
        if (this.header) {
            return this.header.element.nativeElement.getBoundingClientRect().height;
        } else {
            return 0;
        }
    }

    /**
     * returns true if the navigation paradigm is tabbed or subtabbed
     */
    get tabbed() {
        // return this.navigation.navigationparadigm == 'tabbed' || this.navigation.navigationparadigm == 'subtabbed';
        return this.navigation.navigationparadigm == 'subtabbed';
    }

    /**
     * returns if the view is considered small
     */
    get issmall() {
        return this.layout.screenwidth == 'small';
    }

    /**
     * cheks if we have tenant data set and thus shoudl render the tenant bar
     */
    get isTenant() {
        return !_.isEmpty(this.configurationService.getData('tenantconfig'));

    }

    public ngAfterViewInit() {
        this.subscribeToBackendPendingRequests();
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    /**
     * subscribe to backend pending requests to set the
     * @private
     */
    private subscribeToBackendPendingRequests() {
        this.subscriptions.add(this.backend.pendingCountChange$.subscribe(count => {

            if (count > this.pendingRequestsTotal) {
                this.pendingRequestsTotal = count;
            } else if (count == 0) {
                this.pendingRequestsTotal = 0;
            }

            this.progressWidth = count == 0 ? 100 : (100 / this.pendingRequestsTotal) * (this.pendingRequestsTotal - this.backend.pendingRequestsCount);

            this.cdRef.detectChanges();
        }));
    }

}

