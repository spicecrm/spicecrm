/**
 * @module ModuleEmails
 */

import {Component} from '@angular/core';
import {model} from '../../../services/model.service';
import {metadata} from "../../../services/metadata.service";
import {backend} from "../../../services/backend.service";

@Component({
    selector: "email-schedules-beans",
    templateUrl: "./src/modules/emails/templates/emailschedulesbeans.html"
})

export class EmailSchedulesBeans {

    /**
     * the loaded Beans from tehbackend for this schedule
     */
    public beans:any[];

    public loading: boolean = false;

    constructor(private model: model,
                private metadata: metadata,
                private backend: backend
    ) {
        this.getData();
    }

    private refresh() {
        this.getData();
    }

    /**
     * get the data from the backend
     */
    private getData() {
        this.beans = [];
        this.loading = true;
        this.backend.getRequest(`module/EmailSchedules/${this.model.id}/beans`).subscribe(
            res => {
                this.beans = res;
                this.loading = false;
            }
        )
    }

}
