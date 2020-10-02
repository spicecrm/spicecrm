/**
 * @module SpiceInstaller
 */

import {Component} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router} from '@angular/router';
import {configurationService} from '../../../services/configuration.service';
import {toast} from '../../../services/toast.service';
import {backend} from "../../../services/backend.service";
import {spiceinstaller} from "../services/spiceinstaller.service";


@Component({
    selector: 'spice-installer-set-language',
    templateUrl: './src/include/spiceinstaller/templates/spiceinstallersetlanguage.html'
})

export class SpiceInstallerSetLanguage {
    private languages: any = [];
    private loading: boolean = false;
    constructor(
        private toast: toast,
        private http: HttpClient,
        private router: Router,
        private configurationService: configurationService,
        private backend: backend,
        private spiceinstaller: spiceinstaller
    ) {
        // checks the reference
        this.checkReference();
        // loads the languages
        this.http.get(`${this.spiceinstaller.configObject.backendconfig.backendUrl}/KREST/spiceinstaller/getlanguages`).subscribe((result: any) => {
            this.languages = result.languages;
        });
    }

    /**
     * backend call to reference server
     */

    private checkReference() {
        this.loading = true;
        this.http.get(`${this.spiceinstaller.configObject.backendconfig.backendUrl}/KREST/spiceinstaller/checkreference`).subscribe(result => {
            this.loading = false;
            if (!result) {
                this.toast.sendToast('cannot connect to reference server', "error");
            }
        });
    }
    /**
     * sets the chosen language and saves it in the configuration body
     */
    private setLanguage() {
        this.spiceinstaller.configObject.language = this.spiceinstaller.language;
        console.log(this.spiceinstaller.configObject);
        this.spiceinstaller.selectedStep.completed = true;
        this.spiceinstaller.steps[6] = this.spiceinstaller.selectedStep;
        this.spiceinstaller.next(this.spiceinstaller.steps[6]);
    }
}
