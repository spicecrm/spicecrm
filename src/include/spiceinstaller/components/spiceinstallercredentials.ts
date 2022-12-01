/**
 * @module SpiceInstaller
 */

import { Component, Input } from '@angular/core';
import { spiceinstaller, stepObject } from "../services/spiceinstaller.service";


@Component({
    selector: 'spice-installer-credentials',
    templateUrl: '../templates/spiceinstallercredentials.html'
})

export class SpiceInstallerCredentials {

    @Input() public selfStep: stepObject;
    /**
     * condition booleans
     */
    public usernameCondition: boolean = true;
    public passwordCondition: boolean = true;
    public rpPasswordCondition: boolean = true;
    public surnameCondition: boolean = true;
    public emailCondition: boolean = true;

    /**
     * Regex for password
     */
    public pwRegexp: RegExp = new RegExp("(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,})");

    constructor(
        public spiceinstaller: spiceinstaller
    ) {
        this.spiceinstaller.jumpSubject.subscribe( fromTo => {
            if ( fromTo.from === this.selfStep ) {
                if ( this.selfStep.completed || fromTo.to?.pos < this.selfStep.pos ) this.spiceinstaller.jump( fromTo.to );
                else this.saveUser();
            }
        });
    }

    /**
     * set user with provided inputs
     */
    public saveUser() {
        this.usernameCondition = this.spiceinstaller.username.length > 0;
        this.passwordCondition = this.spiceinstaller.password.length > 0 && this.pwRegexp.test(this.spiceinstaller.password);
        this.rpPasswordCondition = this.spiceinstaller.rpPassword == this.spiceinstaller.password;
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
            this.spiceinstaller.jumpSubject.next({ from: this.selfStep, to: this.selfStep.next });
        }
    }

}
