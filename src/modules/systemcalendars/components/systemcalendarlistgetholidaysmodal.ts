/**
 * @module ModuleHolidayCalendars
 */
import {Component, Input} from '@angular/core';
import {language} from '../../../services/language.service';
import {view} from '../../../services/view.service';
import {backend} from '../../../services/backend.service';
import {model} from '../../../services/model.service';
import {toast} from "../../../services/toast.service";

/**
 * a modal that loads the holidays from teh calendarific service
 */
@Component({
    selector: 'system-calendar-list-get-holidays-modal',
    templateUrl: './src/modules/holidaycalendars/templates/systemcalendarlistgetholidaysmodal.html',
})
export class SystemCalendarListGetHolidaysModal {

    /**
     * reference to the modal
     * @private
     */
    private self: any;

    /**
     * the country
     *
     * @private
     */
    private country: string;

    /**
     * the year to get the holidays for
     *
     * @private
     */
    private year: string;

    constructor(
        private backend: backend,
        private model: model,
        private toast: toast,
    ) {
    }

    private close() {
        this.self.destroy();
    }

    private load() {
        this.backend.getRequest(`module/SystemHolidayCalendars/${this.model.id}/calendarific/${this.country}/${this.year}`).subscribe(
            res => {
                this.close();
            },
            err => {
                this.toast.sendToast('Error loading Holidays', 'error');
                console.log(err);
            });
    }

}
