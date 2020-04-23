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
import {modal} from "../../../services/modal.service";


@Component({
    selector: 'spice-installer-review',
    templateUrl: './src/include/spiceinstaller/templates/spiceinstallerreview.html',
})

export class SpiceInstallerReview {
    private configBody: any = {};

    constructor(
        private toast: toast,
        private http: HttpClient,
        private router: Router,
        private configurationService: configurationService,
        private backend: backend,
        private spiceinstaller: spiceinstaller
    ) {
        this.spiceinstaller.currentStep(6);
        this.spiceinstaller.configBody$.subscribe(data => {
            this.configBody = data;
            window.console.log(this.configBody)
        });
    }

    private install() {
        this.http.post(`${this.configBody.backendconfig.backendUrl}/KREST/spiceinstaller/install`, this.configBody).subscribe(
        (response: any) => {
            var res = response;
            if (!res.success) {
                for (let e in res.errors) {
                    this.toast.sendAlert('Error with: ' + e, 'error');
                }
            } else {
                this.http.post('config/set', this.configBody.backendconfig, {}).subscribe(
                    (res : any) => {
                        var response = res;
                        if(response.success == true){
                            this.configurationService.setSiteData(response.site);
                            this.router.navigate(['/login']);
                        } else {
                            //this.checking = false;
                        }
                    },
                    (err: any) => {
                        switch (err.status) {
                            case 401:

                                break;
                        }
                    });
            }
        });
    }
}
