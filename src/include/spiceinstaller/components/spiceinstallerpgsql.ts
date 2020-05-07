/**
 * @module SpiceInstallerModule
 */

import {Component} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {toast} from '../../../services/toast.service';
import {spiceinstaller} from "../services/spiceinstaller.service";


@Component({
    selector: 'spice-installer-pgsql',
    templateUrl: './src/include/spiceinstaller/templates/spiceinstallerpgsql.html'
})

export class SpiceinstallerPostgreSQL {

    private hostNameCondition: boolean = true;
    private userNameCondition: boolean = true;
    private dbNameCondition: boolean = true;

    private loading: boolean = false;

    constructor(
        private toast: toast,
        private http: HttpClient,
        private spiceinstaller: spiceinstaller
    ) {

    }


}
