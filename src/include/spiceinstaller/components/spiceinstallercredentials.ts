/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

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
     * condition booleans
     */
    private usernameCondition: boolean = true;
    private passwordCondition: boolean = true;
    private rpPasswordCondition: boolean = true;
    private surnameCondition: boolean = true;
    private emailCondition: boolean = true;
    /**
     * repeated password variable holder and Regexp for password
     */
    private rpPassword: string = '';
    private pwRegexp: RegExp = new RegExp("(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,})");

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
