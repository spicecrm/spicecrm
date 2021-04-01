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
 * @module Outlook
 */
import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {OutlookConfiguration} from '../services/outlookconfiguration.service';
import {GroupwareService} from "../../../include/groupware/services/groupware.service";
import {session} from "../../../services/session.service";
import {broadcast} from "../../../services/broadcast.service";
import {model} from "../../../services/model.service";

declare var Office: any;

/**
 * Main container for the SpiceCRM Outlook add-in. This gets rendered by the loader.
 * The pane intializes the mailbox and the groupware services. Then it loads the UI and starts the config process
 * if no user and password is set in the store it loads the settings route
 */
@Component({
    selector: 'outlook-pane',
    templateUrl: './src/include/outlook/templates/outlookpane.html'
})
export class OutlookPane implements OnInit {

    constructor(
        private configuration: OutlookConfiguration,
        private groupware: GroupwareService,
        private router: Router,
        private session: session,
        private model: model,
        private broadcast: broadcast
    ) {
        // ToDo: implement pinned pane that relaod when item is changed
        Office.context.mailbox.addHandlerAsync(Office.EventType.ItemChanged, () => {
            this.itemChanged();
        });

    }

    /**
     * display the bottom bar only when we have a message with an id
     */
    get displayBottomBar() {
        return Office.context.mailbox.item.itemType == 'message' && Office.context.mailbox.item.itemId;
    }

    /**
     * Sets the ID of the currently selected email.
     */
    public ngOnInit(): void {
        this.model.module = 'Emails';
        this.model.initialize();
        this.groupware.messageId = Office.context.mailbox.item.itemId;
    }

    private itemChanged() {
        this.groupware.messageId = Office.context.mailbox.item.itemId;
        if (this.router.routerState.snapshot.url == '/groupware/details') {
            this.broadcast.broadcastMessage('groupware.itemchanged');
        } else {
            this.router.navigate(['/groupware/details']);
        }
    }

}
