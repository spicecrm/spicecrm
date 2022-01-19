/**
 * @module ModuleEmails
 */

import {Component} from '@angular/core';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {view} from "../../../services/view.service";
import {metadata} from "../../../services/metadata.service";
import {backend} from "../../../services/backend.service";

@Component({
    selector: "email-schedules-view",
    templateUrl: "../templates/emailschedulesview.html",
    providers: [view],
})

export class EmailSchedulesView {

    public emailschedules: any[] = [];
    public locked: boolean = false;
    public isLoading: boolean = false;

    constructor(public language: language,
                public model: model,
                public view: view,
                public metadata: metadata,
                public backend: backend
    ) {
        this.getData();
    }

    public refresh() {
        this.getData();
    }

    /**
     * get the data from the backend
     */
    public getData() {
        this.isLoading = true;
        this.backend.getRequest(`module/EmailSchedules/myopen/${this.model.id}`).subscribe(result => {
            if (result.status) {
                this.isLoading = false;
                this.emailschedules = result.openschedules;
            } else {
                this.locked = true;
            }
        });
    }


}
