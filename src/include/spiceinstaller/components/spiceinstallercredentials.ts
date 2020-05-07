/**
 * @module SpiceInstaller
 */

import {Component} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {toast} from '../../../services/toast.service';
import {spiceinstaller} from "../services/spiceinstaller.service";


@Component({
    selector: 'spice-installer-credentials',
    templateUrl: './src/include/spiceinstaller/templates/spiceinstallercredentials.html'
})

export class SpiceInstallerCredentials {
    private configBody: any = {};

    private usernameCondition: boolean = true;
    private passwordCondition: boolean = true;
    private surnameCondition: boolean = true;

    constructor(
        private toast: toast,
        private http: HttpClient,
        private spiceinstaller: spiceinstaller
    ) {
    }

    private saveUser() {
        this.usernameCondition = this.spiceinstaller.username.length > 0;
        this.passwordCondition = this.spiceinstaller.password.length > 0;
        this.surnameCondition = this.spiceinstaller.surname.length > 0;

        if (this.usernameCondition && this.passwordCondition && this.surnameCondition) {

            this.spiceinstaller.configObject['credentials'] = {
                username: this.spiceinstaller.username,
                password: this.spiceinstaller.password,
                firstname: this.spiceinstaller.firstname,
                surname: this.spiceinstaller.surname,
                email: this.spiceinstaller.email
            };
            this.spiceinstaller.selectedStep.completed = true;
            this.spiceinstaller.steps[5] = this.spiceinstaller.selectedStep;
            this.spiceinstaller.next(this.spiceinstaller.steps[5]);
        }
    }

}
