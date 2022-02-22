/**
 * @module AdminComponentsModule
 */
import {Component} from '@angular/core';
import {model} from "../../services/model.service";
import {backend} from "../../services/backend.service";
import {toast} from "../../services/toast.service";
import {language} from "../../services/language.service";

/**
 * send kill request to the backend to kill the running process of the job
 */
@Component({
    selector: 'administration-job-kill-button',
    templateUrl: '../templates/administrationjobkillbutton.html'
})
export class AdministrationJobKillButton {

    constructor(public model: model,
                public toast: toast,
                public language: language,
                public backend: backend) {
    }

    /**
     * @return bool disabled if the job is not running (has no process id)
     */
    get disabled(): boolean {
        return !this.model.getField('process_id');
    }

    /**
     * send kill request to the backend to kill the running process of the job
     */
    public execute() {
        this.backend.postRequest(`module/SchedulerJobs/${this.model.id}/kill`).subscribe(res => {

            const label = !res ? 'ERR_FAILED_TO_EXECUTE' : 'MSG_SUCCESSFULLY_EXECUTED';
            const type = !res ? 'error' : 'success';
            this.toast.sendToast(this.language.getLabel(label), type);

        });
    }
}
