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
        };

        this.serverCondition = this.spiceinstaller.server.length > 0;
        this.portCondition = this.spiceinstaller.port.length > 0;
        this.prefixCondition = this.spiceinstaller.prefix.length > 0;

        if (this.serverCondition && this.portCondition && this.prefixCondition) {
            this.loading = true;
            this.http.post(`${this.spiceinstaller.configObject.backendconfig.backendUrl}/KREST/spiceinstaller/checkfts`, body).subscribe(
                (response: any) => {
                    this.loading = false;
                    var res = response;
                    if (!res.success) {
                        for (let e in res.errors) {
                            this.toast.sendAlert('Error with: ' + res.errors[e], 'error');
                        }
                    } else {
                        this.spiceinstaller.selectedStep.completed = true;
                        this.spiceinstaller.configObject['fts'] = res.config;
                        this.spiceinstaller.steps[4] = this.spiceinstaller.selectedStep;
                        this.spiceinstaller.next(this.spiceinstaller.steps[4]);
                    }
                });
        }

    }
}
