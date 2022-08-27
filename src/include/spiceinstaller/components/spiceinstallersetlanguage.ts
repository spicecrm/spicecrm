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
    templateUrl: '../templates/spiceinstallersetlanguage.html'
})

export class SpiceInstallerSetLanguage {
    public languages: any = [];
    public loading: boolean = false;
    constructor(
        public toast: toast,
        public http: HttpClient,
        public router: Router,
        public configurationService: configurationService,
        public backend: backend,
        public spiceinstaller: spiceinstaller
    ) {
        // checks the reference
        this.checkReference();
        // loads the languages
        this.http.get(`${this.spiceinstaller.systemurl}/install/getlanguages`).subscribe((result: any) => {
            this.languages = result.languages;
        });
    }

    /**
     * backend call to reference server
     */

    public checkReference() {
        this.loading = true;
        this.http.get(`${this.spiceinstaller.systemurl}/install/checkreference`).subscribe(result => {
            this.loading = false;
            if (!result) {
                this.toast.sendToast('cannot connect to reference server', "error");
            }
        });
    }
    /**
     * sets the chosen language and saves it in the configuration body
     */
    public setLanguage() {
        this.spiceinstaller.configObject.language = this.spiceinstaller.language;
        this.spiceinstaller.selectedStep.completed = true;
        this.spiceinstaller.steps[6] = this.spiceinstaller.selectedStep;
        this.spiceinstaller.next(this.spiceinstaller.steps[6]);
    }
}
