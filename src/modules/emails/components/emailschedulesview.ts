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
    templateUrl: "./src/modules/emails/templates/emailschedulesview.html",
    providers: [view],
})

export class EmailSchedulesView {

    private emailschedules: any[] = [];
    private locked: boolean = false;
    private isLoading: boolean = false;

    constructor(private language: language,
                private model: model,
                private view: view,
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
