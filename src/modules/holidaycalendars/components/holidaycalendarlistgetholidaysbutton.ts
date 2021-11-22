/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

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
    templateUrl: './src/modules/holidaycalendars/templates/holidaycalendarlistgetholidaysbutton.html',
})
export class HolidayCalendarListGetHolidaysButton {

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
    private enableButton(){
        let capabilityConfig = this.configuration.getCapabilityConfig('holidaycalendars');
        if(capabilityConfig?.calendarific) this.disabled = false;
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
