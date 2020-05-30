/**
 * @module ModuleGSuite
 */
import {Component, Inject, OnInit} from '@angular/core';
import {session} from "../../../services/session.service";
import {Router} from "@angular/router";
import {broadcast} from "../../../services/broadcast.service";
import {GroupwareService} from '../../../include/groupware/services/groupware.service';
import {GSuiteBrokerService} from "../services/gsuitebroker.service";
import {GSuiteGroupware} from "../services/gsuitegroupware.service";

/**
 * Main container for the SpiceCRM GSuite add-in. This gets rendered by the loader.
 * The pane intializes the mailbox and the groupware services. Then it loads the UI and starts the config process
 * if no user and password is set in the store it loads the settings route
 */
@Component({
    selector: 'gsuite-pane',
    templateUrl: './src/include/gsuite/templates/gsuitepane.html'
})
export class GSuitePane implements OnInit {

    /**
     * show/hide bottom bar
     */
    public displayBottomBar: boolean = true;

    constructor(@Inject(GroupwareService) private groupware: GSuiteGroupware,
                private gSuiteBrokerService: GSuiteBrokerService,
                private router: Router,
                private broadcast: broadcast,
                public session: session) {
    }

    /**
     * get the threadId from GSuite and navigate if it is set
     */
    private handleNavigation() {

        this.groupware.getThreadId().subscribe(res => {
            if (!res) return;

            this.groupware.threadId = res;
            if (this.router.routerState.snapshot.url == '/groupware/details') {
                this.broadcast.broadcastMessage('groupware.itemchanged');
            } else {
                this.router.navigate(['/groupware/details']);
            }
        });
    }

    /**
     * call to handle navigation
     */
    public ngOnInit() {
        this.handleNavigation();
    }
}
