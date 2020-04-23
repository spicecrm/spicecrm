/**
 * @module SpiceInstallerModule
 */

import {Component} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router} from '@angular/router';
import {configurationService} from '../../../services/configuration.service';
import {toast} from '../../../services/toast.service';
import {backend} from "../../../services/backend.service";
import {spiceinstaller} from "../services/spiceinstaller.service";


@Component({
    selector: 'spice-installer-fts',
    templateUrl: './src/include/spiceinstaller/templates/spiceinstallerfts.html'
})

export class SpiceInstallerFTS {
    private configBody: any = {};
    private server: string = '';
    private port: string = '';
    private prefix: string = '';

    private serverCondition: boolean = true;
    private portCondition: boolean = true;
    private prefixCondition: boolean = true;

    constructor(
        private toast: toast,
        private http: HttpClient,
        private router: Router,
        private configurationService: configurationService,
        private backend: backend,
        private spiceinstaller: spiceinstaller
    ) {
        this.spiceinstaller.currentStep(4);
        this.spiceinstaller.configBody$.subscribe(data => {
            this.configBody = data;
            window.console.log(this.configBody)
        });
    }

    private checkFTS() {
        let body = {
            server: this.server,
            port: this.port,
            prefix: this.prefix,
            loglevel: 1,
            schedulerpackagesize: 2500,
        };

        this.serverCondition = this.server.length > 0;
        this.portCondition = this.port.length > 0;
        this.prefixCondition = this.prefix.length > 0;

        if (this.serverCondition && this.portCondition && this.prefixCondition) {
            this.http.post(`${this.configBody.backendconfig.backendUrl}/KREST/spiceinstaller/checkfts`, body).subscribe(
                (response: any) => {
                    var res = response;
                    if (!res.success) {
                        for (let e in res.errors) {
                            this.toast.sendAlert('Error with: ' + res.errors[e], 'error');
                        }
                    } else {
                        this.toast.sendToast('success', 'success');
                        let ftsConfig = {fts: res.config};
                        const config = Object.assign(this.configBody, ftsConfig);
                        this.spiceinstaller.configBody(config);
                        this.spiceinstaller.steps[4].completed = true;
                    }
                });
        }

    }
}
