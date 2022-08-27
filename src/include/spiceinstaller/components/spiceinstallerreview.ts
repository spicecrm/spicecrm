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
        this.http.post(`${this.spiceinstaller.systemurl}/install/process`, this.spiceinstaller.configObject).subscribe(
            (response: any) => {
                let res = response;
                this.installing = false;
                if (!res.success) {
                    for (let e in res.errors) {
                        this.toast.sendAlert('Error with: ' + e, 'error');
                    }
                } else {
                    // move away fromt eh installer
                    window.location.href = window.location.href.replace("#/install", "");
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
