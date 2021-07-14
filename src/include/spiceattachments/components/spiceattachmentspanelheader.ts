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
 * @module ModuleWorkflow
 */
import {
    Component, OnDestroy, OnInit
} from '@angular/core';
import {model} from '../../../services/model.service';
import {broadcast} from '../../../services/broadcast.service';
import {language} from '../../../services/language.service';
import {modelattachments} from '../../../services/modelattachments.service';

@Component({
    templateUrl: './src/include/spiceattachments/templates/spiceattachmentspanelheader.html',
    providers:[modelattachments]

})
export class SpiceAttachmentsPanelHeader implements OnInit, OnDestroy {

    /**
     * subscroibe to the broadcast to catch when the panel issues the number
     */
    private broadcastSubscription: any = {};

    /**
     * the count recieved
     */
    private attachmentcount: number = 0;

    constructor(private model: model, private modelattachments: modelattachments, private language: language, private broadcast: broadcast) {
        this.broadcastSubscription = this.broadcast.message$.subscribe(message => {
            this.handleMessage(message);
        });
    }

    /**
     * get the count also if the panel is not forced to load
     */
    public ngOnInit(): void {
        this.modelattachments.module = this.model.module;
        this.modelattachments.id = this.model.id;
        this.modelattachments.getCount().subscribe(count => {
            this.attachmentcount = count;
        });
    }

    /**
     * check if there are workflows
     */
    get hasAttachments() {
        return this.attachmentcount > 0 ? true : false;
    }

    /**
     * handle the broadcast message
     *
     * @param message
     */
    private handleMessage(message: any) {
        // only handle if the module is the list module
        if (message.messagedata.module !== this.model.module && message.messagedata.id !== this.model.id){
            return;
        }

        switch (message.messagetype) {
            case 'attachments.loaded':
                this.attachmentcount = message.messagedata.attachmentcount;
                break;

        }
    }

    /**
     * make sure on destroy to unsubscribe from the broadcast
     */
    public ngOnDestroy() {
        this.broadcastSubscription.unsubscribe();
    }
}
