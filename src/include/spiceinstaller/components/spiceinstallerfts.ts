/*
SpiceUI 2021.01.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

/**
 * @module SpiceInstallerModule
 */

import {Component} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {toast} from '../../../services/toast.service';
import {spiceinstaller} from "../services/spiceinstaller.service";


@Component({
    selector: 'spice-installer-fts',
    templateUrl: './src/include/spiceinstaller/templates/spiceinstallerfts.html'
})

export class SpiceInstallerFTS {
    /**
     * condition booleans
     */
    private serverCondition: boolean = true;
    private portCondition: boolean = true;
    private prefixCondition: boolean = true;
    /**
     * loading boolean
     */
    private loading: boolean = false;
    private protocolOptions: any = [{type: 'http', name: 'HTTP'}, {type: 'https', name: 'HTTPS'}];
    constructor(
        private toast: toast,
        private http: HttpClient,
        private spiceinstaller: spiceinstaller
    ) {

    }

    /**
     * checks if a connection with the fts server is possible, saves the configuration
     */
    private checkFTS() {

        let body = {
            server: this.spiceinstaller.server,
            port: this.spiceinstaller.port,
            prefix: this.spiceinstaller.prefix,
            loglevel: 1,
            schedulerpackagesize: 2500,
            protocol: this.spiceinstaller.transferProtocol
        };

        this.serverCondition = this.spiceinstaller.server.length > 0;
        this.portCondition = this.spiceinstaller.port.length > 0;
        this.prefixCondition = this.spiceinstaller.prefix.length > 0;

        if (this.serverCondition && this.portCondition && this.prefixCondition) {
            this.loading = true;
            this.http.post(`${this.spiceinstaller.configObject.backendconfig.backendUrl}/spiceinstaller/checkfts`, body).subscribe(
                (response: any) => {
                    this.loading = false;
                    let res = response;
                    if (!res.success) {
                        for (let e in res.errors) {
                            this.toast.sendAlert('Error with: ' + res.errors[e], 'error');
                        }
                    } else {
                        this.spiceinstaller.selectedStep.completed = true;
                        this.spiceinstaller.configObject.fts = res.config;
                        this.spiceinstaller.steps[4] = this.spiceinstaller.selectedStep;
                        this.spiceinstaller.next(this.spiceinstaller.steps[4]);
                    }
                });
        }

    }
}
