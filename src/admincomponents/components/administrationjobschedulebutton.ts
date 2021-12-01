/**
 * @module AdminComponentsModule
 */
import {Component} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {model} from "../../services/model.service";
import {backend} from "../../services/backend.service";
import {modal} from "../../services/modal.service";
import {toast} from "../../services/toast.service";
import {broadcast} from "../../services/broadcast.service";

/**
* @ignore
*/
declare var _;

@Component({
    selector: 'administration-job-schedule-button',
    templateUrl: '../templates/administrationjobschedulebutton.html'
})
export class AdministrationJobScheduleButton {

    constructor(public model: model,
                public language: language,
                public metadata: metadata,
                public broadcast: broadcast,
                public toast: toast,
                public modal: modal,
                public backend: backend) {
    }

    public execute() {
        this.modal.openModal('SystemLoadingModal', false).subscribe(modalRef => {
            this.backend.postRequest('module/SchedulerJobs/'+ this.model.id +'/schedule').subscribe(res => {
                modalRef.instance.self.destroy();
                this.model.getData();

                if (res) {
                    this.toast.sendToast(this.language.getLabel('MSG_SUCCESSFULLY_EXECUTED'), 'success');
                } else {
                    this.toast.sendToast(this.language.getLabel('ERR_FAILED_TO_EXECUTE'), 'error');
                }
                this.broadcast.broadcastMessage('job.run');
            }, err => {
                modalRef.instance.self.destroy();
                this.toast.sendToast(this.language.getLabel('ERR_FAILED_TO_EXECUTE'), 'error');
                this.broadcast.broadcastMessage('job.run');
            });
        });
    }
}
