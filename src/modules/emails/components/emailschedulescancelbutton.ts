/**
 * @module ModuleEmails
 */
import {Component, EventEmitter, Output} from '@angular/core';
import {model} from '../../../services/model.service';
import {modal} from '../../../services/modal.service';
import {backend} from '../../../services/backend.service';

/**
 * renders a button that allows cancelling a scheduled email
 */
@Component({
    selector: "email-schedules-cancel-button",
    templateUrl: "../templates/emailschedulescancelbutton.html",
})
export class EmailSchedulesCancelButton {

    @Output() public actionemitter: EventEmitter<any> = new EventEmitter<any>();

    constructor(
        public model: model,
        public modal: modal,
        public backend: backend
    ) {
    }

    /**
     * checks the acl rights for the user to export and that we have some items selected
     */
    get disabled() {
        return  !this.model.checkAccess('edit') || this.model.getField('email_schedule_status') != 'open';
    }

    /**
     * throw error if the field emails doesnt exist
     */
    public execute() {
        this.modal.confirm('MSG_CANCEL_EMAILSCHEDULE', 'MSG_CANCEL_EMAILSCHEDULE').subscribe(
            res => {
                if(res){
                    this.backend.putRequest(`module/EmailSchedules/${this.model.id}/cancel`).subscribe(
                        res => {
                            this.model.setField('email_schedule_status', 'cancelled');
                            this.actionemitter.emit('save');
                        }
                    );
                }
            }
        )
    }

}
