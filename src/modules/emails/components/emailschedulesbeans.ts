/**
 * @module ModuleEmails
 */

import {Component, OnDestroy} from '@angular/core';
import {model} from '../../../services/model.service';
import {metadata} from "../../../services/metadata.service";
import {backend} from "../../../services/backend.service";
import {Subscription} from "rxjs";
import {language} from "../../../services/language.service";

@Component({
    selector: "email-schedules-beans",
    templateUrl: "../templates/emailschedulesbeans.html"
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
    public loadedStatus: string;

    /**
     *
     * @private
     */
    public subscriptions: Subscription = new Subscription();

    constructor(public model: model,
                public metadata: metadata,
                public language: language,
                public backend: backend
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
     * translates the value of the status properly
     *
     * @param enumvalue
     */
    public getValue(enumvalue): string {
        try {
            return this.language.languagedata.applist.emailschedule_status_dom[enumvalue] ? this.language.languagedata.applist.emailschedule_status_dom[enumvalue] : enumvalue;
        } catch (e) {
            return enumvalue;
        }
    }


    /**
     * get the data from the backend
     */
    public getData() {
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
