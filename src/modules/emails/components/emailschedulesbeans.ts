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
