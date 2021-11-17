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
 * @module ModuleEmails
 */

import {Component, OnDestroy} from '@angular/core';
import {model} from '../../../services/model.service';
import {metadata} from "../../../services/metadata.service";
import {backend} from "../../../services/backend.service";
import {Subscription} from "rxjs";

@Component({
    selector: "email-schedules-beans",
    templateUrl: "./src/modules/emails/templates/emailschedulesbeans.html"
})

export class EmailSchedulesBeans implements OnDestroy {

    /**
     * the loaded Beans from tehbackend for this schedule
     */
    public beans: any[];

    /**
     * indicator if we are loading
     */
    public loading: boolean = false;

    /**
     * the status we last loaded the beans
     *
     * @private
     */
    private loadedStatus: string;

    /**
     *
     * @private
     */
    private subscriptions: Subscription = new Subscription();

    constructor(private model: model,
                private metadata: metadata,
                private backend: backend
    ) {
        this.subscriptions.add(
            this.model.data$.subscribe(data => {
                this.getData();
            })
        )
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    /**
     * get the data from the backend
     */
    private getData() {
        if (this.model.getField('email_schedule_status') && (!this.loadedStatus || this.loadedStatus != this.model.getField('email_schedule_status'))) {
            this.beans = [];
            this.loading = true;
            this.loadedStatus = this.model.getField('email_schedule_status');
            this.backend.getRequest(`module/EmailSchedules/${this.model.id}/beans`).subscribe(
                res => {
                    this.beans = res;
                    this.loading = false;
                }
            )
        }
    }

}
