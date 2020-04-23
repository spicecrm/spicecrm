/**
 * @module SpiceInstallerModule
 */

import {
    Component
} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {Router} from '@angular/router';
import {loginService} from '../../../services/login.service';
import {configurationService} from '../../../services/configuration.service';
import {session} from '../../../services/session.service';
import {toast} from '../../../services/toast.service';
import {language} from '../../../services/language.service';
import {backend} from "../../../services/backend.service";
import {spiceinstaller} from "../services/spiceinstaller.service";


@Component({
    selector: 'spice-installer-licence',
    templateUrl: './src/include/spiceinstaller/templates/spiceinstallerlicence.html'
})

export class SpiceInstallerLicence {
    private year: any = new Date();
    private author: string = '';
    constructor(
        private toast: toast,
        private http: HttpClient,
        private router: Router,
        private configurationService: configurationService,
        private backend: backend,
        private spiceinstaller: spiceinstaller
    ) {
        this.spiceinstaller.currentStep(2);
        this.author = 'SpiceCRM';
        this.year = this.year.getFullYear();
    }

}
