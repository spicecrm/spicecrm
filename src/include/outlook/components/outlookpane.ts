/**
 * @module Outlook
 */
import {Component, OnInit} from '@angular/core';

import {OutlookConfiguration} from '../services/outlookconfiguration.service';
import {GroupwareService} from "../../../include/groupware/services/groupware.service";
import {session} from "../../../services/session.service";

declare var Office: any;

@Component({
    selector: 'outlook-pane',
    templateUrl: './src/include/outlook/templates/outlookpane.html'
})
export class OutlookPane implements OnInit {

    constructor(
        private configuration: OutlookConfiguration,
        private groupware: GroupwareService,
        private session: session
    ) {
    }

    public ngOnInit(): void {
        this.groupware.messageId = Office.context.mailbox.item.itemId;
    }

}
