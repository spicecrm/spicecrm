/**
 * @module ServiceComponentsModule
 */
import {Component, EventEmitter} from "@angular/core";
import {model} from "../../../services/model.service";
import {backend} from "../../../services/backend.service";
import {metadata} from "../../../services/metadata.service";
import {language} from "../../../services/language.service";

/**
* @ignore
*/
declare var moment: any;

@Component({
    templateUrl: '../templates/serviceticketprolongmodal.html',
})
export class ServiceTicketProlongModal {
    public self: any = {};
    public prolongDate: any = new moment();
    public minDate: any;
    public maxDate: any;
    public prolongReason: string = '';
    public saving: boolean = false;

    constructor(
        public model: model,
        public metadata: metadata,
        public language: language,
        public backend: backend,
    ) {
        this.minDate = new moment();
        this.maxDate = new moment().add(5, 'days');
    }

    public cancel() {
        this.self.destroy();
    }

    public save() {
        this.saving = true;
        this.backend.postRequest('module/ServiceTickets/' + this.model.id + '/prolong', {}, {
            prolonged_until: this.prolongDate.format("YYYY-MM-DD"),
            prolongation_reason: this.prolongReason
        }).subscribe(
            status => {
                this.model.setField('prolonged_until', this.prolongDate);
                this.self.destroy();
            },
            error => {
                this.saving = false;
            });
    }

    public setDate(date) {
        this.prolongDate = date;
    }
}
