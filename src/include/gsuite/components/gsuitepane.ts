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
import {model} from "../../../services/model.service";
import {metadata} from "../../../services/metadata.service";

/**
 * Main container for the SpiceCRM GSuite add-in. This gets rendered by the loader.
 * The pane intializes the mailbox and the groupware services. Then it loads the UI and starts the config process
 * if no user and password is set in the store it loads the settings route
 */
@Component({
    selector: 'gsuite-pane',
    templateUrl: '../templates/gsuitepane.html',
    providers: [
        {provide: GroupwareService, useClass: GSuiteGroupware},
        GSuiteBrokerService,
        model
    ]
})
export class GSuitePane implements OnInit {

    /**
     * show/hide bottom bar
     */
    public displayBottomBar: boolean = true;

    constructor(@Inject(GroupwareService) public groupware: GSuiteGroupware,
                public gSuiteBrokerService: GSuiteBrokerService,
                public router: Router,
                public broadcast: broadcast,
                public model: model,
                public metadata: metadata,
                public session: session) {
    }

    /**
     * get the threadId from GSuite and navigate if it is set
     */
    public handleNavigation() {

        this.groupware.getThreadId().subscribe(res => {
            if (!res) return;

            this.groupware.threadId = res;
            this.groupware.emailId = '';

            const config = this.metadata.getComponentConfig('GSuitePane');
            const mainRoute = !config.mainRoute ? '/groupware/details' : config.mainRoute;

            if (this.router.routerState.snapshot.url == mainRoute) {
                this.broadcast.broadcastMessage('groupware.itemchanged');
            } else {
                this.router.navigate([mainRoute]);
            }
        });
    }

    /**
     * call to handle navigation
     */
    public ngOnInit() {
        this.model.module = 'Emails';
        this.model.initialize();
        this.handleNavigation();
    }
}
