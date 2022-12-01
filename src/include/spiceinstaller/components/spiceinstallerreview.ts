/**
 * @module SpiceInstallerModule
 */

import { AfterViewInit, Component, Input } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router} from '@angular/router';
import {configurationService} from '../../../services/configuration.service';
import {toast} from '../../../services/toast.service';
import {modal} from '../../../services/modal.service';
import { spiceinstaller, stepObject } from "../services/spiceinstaller.service";

@Component({
    selector: 'spice-installer-review',
    templateUrl: '../templates/spiceinstallerreview.html',
})
export class SpiceInstallerReview implements AfterViewInit {

    @Input() public selfStep: stepObject;

    public installing: boolean = false;

    public prefsToReview = {
        'Timezone': 'timezone',
        'Date Format': 'datef',
        'Time Format': 'timef',
        'Distance Unit System': 'distance_unit_system',
        'Name Format': 'locale_name_format',
        'Week Start Day': 'week_day_start',
        'Week Days Count': 'week_days_count',
        'Export Delimiter': 'export_delimiter',
        'Export Charset': 'export_charset'
    };

    constructor(
        public toast: toast,
        public modal: modal,
        public http: HttpClient,
        public router: Router,
        public configurationService: configurationService,
        public spiceinstaller: spiceinstaller
    ) {
        // this.prefsToReview['Number Format'] = this.getNumberFormat;

        this.spiceinstaller.jumpSubject.subscribe( fromTo => {
            if ( fromTo.from === this.selfStep ) {
                if ( this.selfStep.completed || fromTo.to?.pos < this.selfStep.pos ) this.spiceinstaller.jump( fromTo.to );
            }
        });
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

    public showPreference( name ): string {
        return typeof this.prefsToReview[name] === 'function' ? this.prefsToReview[name]() : this.spiceinstaller.configObject.preferences[this.prefsToReview[name]];
    }

    public getNumberFormat(): string {
        return '1'
            + this.spiceinstaller.configObject.preferences.num_grp_sep
            + '000'
            + this.spiceinstaller.configObject.preferences.num_grp_sep
            + '000'
            + this.spiceinstaller.configObject.preferences.dec_sep
            + ( '0'.repeat( this.spiceinstaller.configObject.preferences.currency_significant_digits ) );
    }

}
