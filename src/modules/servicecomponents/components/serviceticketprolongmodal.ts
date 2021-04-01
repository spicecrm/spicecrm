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
        this.backend.postRequest('modules/ServiceTickets/' + this.model.id + '/prolong', {}, {
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