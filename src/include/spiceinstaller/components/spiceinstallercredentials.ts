/**
 * @module SpiceInstaller
 */

import {Component} from '@angular/core';
import {spiceinstaller} from "../services/spiceinstaller.service";


@Component({
    selector: 'spice-installer-credentials',
    templateUrl: './src/include/spiceinstaller/templates/spiceinstallercredentials.html'
})

export class SpiceInstallerCredentials {

    /**
     * coondition booleans
     */
    private usernameCondition: boolean = true;
    private passwordCondition: boolean = true;
    private rpPasswordCondition: boolean = true;
    private surnameCondition: boolean = true;
    /**
     * repeated password variable holder and Regexp for password
     */
    private rpPassword: string = '';
    private pwRegexp: RegExp = new RegExp("(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,})")

    constructor(
        private spiceinstaller: spiceinstaller
    ) {
    }

    /**
     * set user with provided inputs
     */
    private saveUser() {
        this.usernameCondition = this.spiceinstaller.username.length > 0;
        this.passwordCondition = this.spiceinstaller.password.length > 0 && this.pwRegexp.test(this.spiceinstaller.password);
        this.rpPasswordCondition = this.rpPassword == this.spiceinstaller.password;
        this.surnameCondition = this.spiceinstaller.surname.length > 0;

        if (this.usernameCondition && this.passwordCondition && this.rpPasswordCondition && this.surnameCondition) {

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
