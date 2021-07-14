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
 * @module SpiceInstaller
 */

import {Component} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {toast} from '../../../services/toast.service';
import {spiceinstaller} from "../services/spiceinstaller.service";


@Component({
    selector: 'spice-installer-systemcheck',
    templateUrl: './src/include/spiceinstaller/templates/spiceinstallersystemcheck.html',
})

export class SpiceInstallerSystemCheck {
    private loading: boolean = false;
    private requirements: any = [];

    constructor(
        private toast: toast,
        private http: HttpClient,
        private spiceinstaller: spiceinstaller
    ) {

        this.checkSystem();
    }


    private checkSystem() {
        this.loading = true;
        this.http.get(`${this.spiceinstaller.configObject.backendconfig.backendUrl}/install/check`).subscribe((response: any) => {
            this.loading = false;
            let result = response;
            this.requirements = result.requirements;
            if (result.success) {
                this.spiceinstaller.selectedStep.completed = true;
                this.spiceinstaller.dbdrivers = this.requirements.dbdrivers;
            } else {
                this.toast.sendToast('error, missing requirements', "error");
            }
        },(err: any) => {
            this.loading = false;
            switch (err.status) {
                case 500:
                    this.toast.sendAlert(err.message, 'error');
                    break;
            }
        });
    }

}
