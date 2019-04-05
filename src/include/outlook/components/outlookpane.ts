import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

import {OutlookConfiguration} from '../services/outlookconfiguration.service';
import {GroupwareService} from "../../groupware/services/groupware.service";

declare var Office: any;

@Component({
    selector: 'outlook-pane',
    templateUrl: './src/include/outlook/templates/outlookpane.html'
})
export class OutlookPane implements OnInit {

    constructor(
        private configuration: OutlookConfiguration,
        private groupware: GroupwareService,
        private router: Router,
    ) {

    }

    public ngOnInit(): void {
        this.groupware.messageId = Office.context.mailbox.item.itemId;
        // if(this.configuration.hasSettings()) {
        //     this.router.navigate(['outlooklogin']);
        // } else {
        //     this.router.navigate(['settings']);
        // }
    }

}
