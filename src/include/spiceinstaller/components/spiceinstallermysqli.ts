/**
 * @module SpiceInstallerModule
 */

import {Component} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {toast} from '../../../services/toast.service';
import {spiceinstaller} from "../services/spiceinstaller.service";


@Component({
    selector: 'spice-installer-mysqli',
    templateUrl: './src/include/spiceinstaller/templates/spiceinstallermysqli.html'
})

export class SpiceinstallerMySQLi {
    private hostNameCondition: boolean = true;
    private userNameCondition: boolean = true;
    private dbNameCondition: boolean = true;

    constructor(
        private toast: toast,
        private http: HttpClient,
        private spiceinstaller: spiceinstaller
    ) {

    }


}
