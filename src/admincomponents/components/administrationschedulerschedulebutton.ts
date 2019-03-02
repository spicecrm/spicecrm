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

declare var _;

@Component({
    selector: 'administration-scheduler-schedule-button',
    templateUrl: './src/admincomponents/templates/administrationschedulerschedulebutton.html'
})
export class AdministrationSchedulerScheduleButton {

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
            this.backend.postRequest('module/Scheduler/'+ this.model.id +'/runjob').subscribe(res => {
                modalRef.instance.self.destroy();
                if (res) {
                    this.toast.sendToast(this.language.getLabel('MSG_SUCCESSFULLY_EXECUTED'), 'success');
                } else {
                    this.toast.sendToast(this.language.getLabel('ERR_FAILED_TO_EXECUTE'), 'error');
                }
                this.broadcast.broadcastMessage('scheduler.run');
            }, err => {
                modalRef.instance.self.destroy();
                this.toast.sendToast(this.language.getLabel('ERR_FAILED_TO_EXECUTE'), 'error');
                this.broadcast.broadcastMessage('scheduler.run');
            });
        });
    }
}