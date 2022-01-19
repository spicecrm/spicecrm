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
    selector: 'system-calendar-list-get-holidays-button',
    templateUrl: '../templates/systemcalendarlistgetholidaysbutton.html',
})
export class SystemCalendarListGetHolidaysButton {

    /**
     * disablöes the button by default
     */
    public disabled = true;

    constructor(
        private model: model,
        private modal: modal,
        private configuration: configurationService,
        private injector: Injector
    ) {
        this.enableButton();
    }

    /**
     * check the clendarific API setting .. if an PAI key is there
     * @private
     */
    private enableButton() {
        let capabilityConfig = this.configuration.getCapabilityConfig('holidaycalendars');
        if (capabilityConfig?.calendarific) this.disabled = false;
    }

    /**
     * excecute the action
     *
     * @private
     */
    private execute() {
        this.modal.openModal('HolidayCalendarListGetHolidaysModal', true, this.injector);
    }
}
