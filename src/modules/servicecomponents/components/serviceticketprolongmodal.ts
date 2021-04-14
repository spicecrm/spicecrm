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
    templateUrl: './src/modules/servicecomponents/templates/serviceticketprolongmodal.html',
})
export class ServiceTicketProlongModal {
    private self: any = {};
    private prolongDate: any = new moment();
    private minDate: any;
    private maxDate: any;
    private prolongReason: string = '';
    private saving: boolean = false;

    constructor(
        private model: model,
        private metadata: metadata,
        private language: language,
        private backend: backend,
    ) {
        this.minDate = new moment();
        this.maxDate = new moment().add(5, 'days');
    }

    private cancel() {
        this.self.destroy();
    }

    private save() {
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

    private setDate(date) {
        this.prolongDate = date;
    }
}