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
    selector: 'spice-installer-detail-container',
    templateUrl: './src/include/spiceinstaller/templates/spiceinstallerdetailcontainer.html',
})

export class SpiceInstallerDetailContainer {

    constructor(
        private toast: toast,
        private http: HttpClient,
        private router: Router,
        private configurationService: configurationService,
        private backend: backend,
        private spiceinstaller: spiceinstaller,
    ) {

    }


}
