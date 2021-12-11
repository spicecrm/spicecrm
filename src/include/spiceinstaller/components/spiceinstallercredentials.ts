/**
 * @module SpiceInstaller
 */

import {Component} from '@angular/core';
import {spiceinstaller} from "../services/spiceinstaller.service";


@Component({
    selector: 'spice-installer-credentials',
    templateUrl: '../templates/spiceinstallercredentials.html'
})

export class SpiceInstallerCredentials {

    /**
     * condition booleans
     */
    public usernameCondition: boolean = true;
    public passwordCondition: boolean = true;
    public rpPasswordCondition: boolean = true;
    public surnameCondition: boolean = true;
    public emailCondition: boolean = true;
    /**
     * repeated password variable holder and Regexp for password
     */
    public rpPassword: string = '';
    public pwRegexp: RegExp = new RegExp("(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,})");

    constructor(
        public spiceinstaller: spiceinstaller
    ) {
    }

    /**
     * set user with provided inputs
     */
    public saveUser() {
        this.usernameCondition = this.spiceinstaller.username.length > 0;
        this.passwordCondition = this.spiceinstaller.password.length > 0 && this.pwRegexp.test(this.spiceinstaller.password);
        this.rpPasswordCondition = this.rpPassword == this.spiceinstaller.password;
        this.surnameCondition = this.spiceinstaller.surname.length > 0;
        this.emailCondition = this.spiceinstaller.email.length > 0;

        if (this.usernameCondition && this.passwordCondition && this.rpPasswordCondition && this.surnameCondition && this.emailCondition) {

            this.spiceinstaller.configObject.credentials = {
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
