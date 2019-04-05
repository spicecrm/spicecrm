import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

import {OutlookConfiguration} from '../services/outlookconfiguration.service';
import {GroupwareService} from "../../groupware/services/groupware.service";
import {session} from "../../../services/session.service";
import {metadata} from "../../../services/metadata.service";
import {language} from "../../../services/language.service";

declare var Office: any;

@Component({
    selector: 'outlook-pane',
    templateUrl: './src/include/outlook/templates/outlookpane.html'
})
export class OutlookPane implements OnInit {

    private _currentroute: string = 'mailitem';
    // private actions: any = [];

    constructor(
        private configuration: OutlookConfiguration,
        private groupware: GroupwareService,
        private router: Router,
        private session: session,
        private metadata: metadata,
        private language: language
    ) {
    }


    get currentroute() {
        return this._currentroute;
    }

    set currentroute(route) {
        if (route) {
            this._currentroute = route;

            this.router.navigate([route]);
        }
    }

    get actions() {
        let componentConfig = this.metadata.getComponentConfig('OutlookPane');
        if (componentConfig.actionset) {
            return this.metadata.getActionSetItems(componentConfig.actionset);
        }
        return [];
    }

    public ngOnInit(): void {
        this.groupware.messageId = Office.context.mailbox.item.itemId;
        // if(this.configuration.hasSettings()) {
        //     this.router.navigate(['outlooklogin']);
        // } else {
        //     this.router.navigate(['settings']);
        // }

        // load the actions
        /*
        let componentConfig = this.metadata.getComponentConfig('OutlookPane');
        if (componentConfig.actionset) {
            this.actions = this.metadata.getActionSetItems(componentConfig.actionset);
        }
         */
    }

    private openSettings() {
        this.router.navigate(['settings']);
    }

}
