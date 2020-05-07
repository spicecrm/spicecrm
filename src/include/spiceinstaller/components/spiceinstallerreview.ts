/**
 * @module SpiceInstallerModule
 */

import {AfterViewInit, Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router} from '@angular/router';
import {configurationService} from '../../../services/configuration.service';
import {toast} from '../../../services/toast.service';
import {spiceinstaller} from "../services/spiceinstaller.service";


@Component({
    selector: 'spice-installer-review',
    templateUrl: './src/include/spiceinstaller/templates/spiceinstallerreview.html',
})

export class SpiceInstallerReview implements AfterViewInit{
    private loading: boolean = false;

    constructor(
        private toast: toast,
        private http: HttpClient,
        private router: Router,
        private configurationService: configurationService,
        private spiceinstaller: spiceinstaller
    ) {
        window.console.log(this.spiceinstaller.configObject);

    }

    public ngAfterViewInit() {
        console.log('after');
        this.spiceinstaller.selectedStep.completed = true;
        this.spiceinstaller.steps[7] = this.spiceinstaller.selectedStep;
    }

    /**
     * sends the configuration data to the backend, sets the site data and redirects to the login
     */
    private install() {
        this.loading = true;
        this.http.post(`${this.spiceinstaller.configObject.backendconfig.backendUrl}/KREST/spiceinstaller/install`, this.spiceinstaller.configObject).subscribe(
            (response: any) => {
                var res = response;
                this.loading = false;
                if (!res.success) {
                    for (let e in res.errors) {
                        this.toast.sendAlert('Error with: ' + e, 'error');
                    }
                } else {
                    this.http.post('config/set', this.spiceinstaller.configObject.backendconfig, {}).subscribe(
                        (res: any) => {
                            var response = res;
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
            });
    }
}
