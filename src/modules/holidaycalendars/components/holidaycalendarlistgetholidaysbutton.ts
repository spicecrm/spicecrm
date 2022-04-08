/**
 * @module ModuleHolidayCalendars
 */
import {Component, Injector} from '@angular/core';

import {model} from '../../../services/model.service';
import {modal} from "../../../services/modal.service";
import {configurationService} from "../../../services/configuration.service";

/**
 * a modal that loads the holidays from teh calendarific service
 * thgis requires that the api key is set in teh cofnugration then the button will be enabled
 */
@Component({
    selector: 'holiday-calendar-list-get-holidays-button',
    templateUrl: '../templates/holidaycalendarlistgetholidaysbutton.html',
})
export class HolidayCalendarListGetHolidaysButton {

    /**
     * disablöes the button by default
     */
    public disabled = true;

    constructor(
        public model: model,
        public modal: modal,
        public configuration: configurationService,
        public injector: Injector
    ) {
        this.enableButton();
    }

    /**
     * check the clendarific API setting .. if an PAI key is there
     * @private
     */
    public enableButton() {
        let capabilityConfig = this.configuration.getCapabilityConfig('holidaycalendars');
        if (capabilityConfig?.calendarific) this.disabled = false;
    }

    /**
     * excecute the action
     *
     * @private
     */
    public execute() {
        this.modal.openModal('HolidayCalendarListGetHolidaysModal', true, this.injector);
    }
}
