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
 * @module GlobalComponents
 */
import {
    Component, EventEmitter, Output
} from '@angular/core';
import {loginService} from '../../services/login.service';
import {session} from '../../services/session.service';

/**
 * a modal to prompt the user for the password to relogin
 * this is rendered when an http request fails because the session is expired
 * it prompts the user to relogin with the current logged in user and the current login method
 */
@Component({
    selector: 'global-re-login',
    templateUrl: './src/globalcomponents/templates/globalrelogin.html',
})
export class GlobalReLogin {

    /**
     * reference to the modal itself
     *
     * @private
     */
    private self: any;

    /**
     * the password for the user
     *
     * @private
     */
    private password: string;

    /**
     * emits if the user logged in successfully
     *
     * @private
     */
    @Output() private loggedin: EventEmitter<boolean> = new EventEmitter<boolean>();

    /**
     * indicator that a relogin is running
     *
     * @private
     */
    private loggingIn: boolean = false;

    constructor(private login: loginService, private session: session) {
    }

    private tokenLogin(token) {
        this.loggingIn = true;
        this.login.relogin(null, token).subscribe(
            res => {
                this.loggedin.emit(true);
                this.close();
            },
            error => {
                this.loggingIn = false;
            }
        );
    }

    private relogin() {
        this.loggingIn = true;
        this.login.relogin(this.password, null).subscribe(
            res => {
                this.loggedin.emit(true);
                this.close();
            },
            error => {
                this.loggingIn = false;
            }
        );
    }

    /**
     * cleans the session and renavigates to the login screen
     *
     * @private
     */
    private logout() {
        this.login.logout(true);
        this.close();
    }

    /**
     * closes the modal
     * @private
     */
    private close() {
        this.self.destroy();
    }
}
