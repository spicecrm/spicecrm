/**
 * @module SpiceInstallerModule
 */

import {AfterViewInit, Component} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router} from '@angular/router';
import {configurationService} from '../../../services/configuration.service';
import {toast} from '../../../services/toast.service';
import {modal} from '../../../services/modal.service';
import {spiceinstaller} from "../services/spiceinstaller.service";


@Component({
    selector: 'spice-installer-review',
    templateUrl: '../templates/spiceinstallerreview.html',
})

export class SpiceInstallerReview implements AfterViewInit {
    public installing: boolean = false;

    constructor(
        public toast: toast,
        public modal: modal,
        public http: HttpClient,
        public router: Router,
        public configurationService: configurationService,
        public spiceinstaller: spiceinstaller
    ) {

    }

    public ngAfterViewInit() {
        this.spiceinstaller.selectedStep.completed = true;
        this.spiceinstaller.steps[7] = this.spiceinstaller.selectedStep;
    }

    /**
     * sends the configuration data to the backend, sets the site data and redirects to the login
     */
    public install() {
        this.installing = true;
        this.http.post(`${this.spiceinstaller.configObject.backendconfig.backendUrl}/install/process`, this.spiceinstaller.configObject).subscribe(
            (response: any) => {
                let res = response;
                this.installing = false;
                if (!res.success) {
                    for (let e in res.errors) {
                        this.toast.sendAlert('Error with: ' + e, 'error');
                    }
                } else {
                    this.http.post('config/set', this.spiceinstaller.configObject.backendconfig, {}).subscribe(
                        (res: any) => {
                            let response = res;
                            if (response.success == true) {
                                this.configurationService.setSiteData(response.site);
                                this.router.navigate(['/login']);
                            }
                        },
                        (err: any) => {
                            switch (err.status) {
                                case 401:

                                    break;
                            }
                        });
                }
            },
            (error: any) => {
                switch (error.status) {
                    case 500:
                        this.toast.sendAlert(error.message, 'error');
                        break;
                }
                this.installing = false;
            });
    }
}
