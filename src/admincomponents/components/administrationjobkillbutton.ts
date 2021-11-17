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
 * @module AdminComponentsModule
 */
import {Component} from '@angular/core';
import {model} from "../../services/model.service";
import {backend} from "../../services/backend.service";
import {toast} from "../../services/toast.service";
import {language} from "../../services/language.service";

/**
 * send kill request to the backend to kill the running process of the job
 */
@Component({
    selector: 'administration-job-kill-button',
    templateUrl: './src/admincomponents/templates/administrationjobkillbutton.html'
})
export class AdministrationJobKillButton {

    constructor(public model: model,
                public toast: toast,
                public language: language,
                public backend: backend) {
    }

    /**
     * @return bool disabled if the job is not running (has no process id)
     */
    get disabled(): boolean {
        return !this.model.data.process_id;
    }

    /**
     * send kill request to the backend to kill the running process of the job
     */
    public execute() {
        this.backend.postRequest(`module/SchedulerJobs/${this.model.id}/kill`).subscribe(res => {

            const label = !res ? 'ERR_FAILED_TO_EXECUTE' : 'MSG_SUCCESSFULLY_EXECUTED';
            const type = !res ? 'error' : 'success';
            this.toast.sendToast(this.language.getLabel(label), type);

        });
    }
}
