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
    selector: 'holiday-calendar-list-get-holidays-modal',
    templateUrl: '../templates/holidaycalendarlistgetholidaysmodal.html',
})
export class HolidayCalendarListGetHolidaysModal {

    /**
     * reference to the modal
     * @private
     */
    public self: any;

    /**
     * the country
     *
     * @private
     */
    public country: string;

    /**
     * the year to get the holidays for
     *
     * @private
     */
    public year: string;

    constructor(
        public backend: backend,
        public model: model,
        public toast: toast,
    ) {
    }

    public close() {
        this.self.destroy();
    }

    public load() {
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
