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
import {HttpClient} from "@angular/common/http";
import {Component, EventEmitter, Input, Output} from "@angular/core";
import {backend} from "../../services/backend.service";
import {configurationService} from "../../services/configuration.service";
import {loginService} from "../../services/login.service";
import {session} from "../../services/session.service";
import {libloader} from "../../services/libloader.service";
import {toast} from "../../services/toast.service";

/**
 * @ignore
 */
declare var gapi: any;

/**
 * a login button that triggers the authentication via Google if that is enabled for the system
 */
@Component({
    selector: "global-login-google",
    templateUrl: "./src/globalcomponents/templates/globallogingoogle.html"
})
export class GlobalLoginGoogle {

    @Input() private authenticatedUser: string;

    /**
     * determines if the buitton is rendered or not
     */
    private visible: boolean = false;

    /**
     * if the button is disabled .. while the libraries are loading
     */
    private disabled: boolean = true;

    /**
     * the google auth object
     */
    public auth2: any;

    /**
     * emits the token
     *
     * @private
     */
    @Output() private token: EventEmitter<string> = new EventEmitter<string>();

    constructor(
        private backend: backend,
        private configuration: configurationService,
        private http: HttpClient,
        private loginService: loginService,
        private session: session,
        private libloader: libloader,
        private toast: toast
    ) {
        // listen to config changes and trigger the initialization
        this.configuration.loaded$.subscribe((loaded) => {
            if (loaded) this.googleInit();
        });
    }

    /**
     * initialize and load the google libraries
     */
    public googleInit() {
        let config = this.configuration.getCapabilityConfig('google_oauth');
        if (config?.clientid) {
            this.visible = true;
            this.libloader.loadFromSource(["https://apis.google.com/js/platform.js"]).subscribe(
                success => {
                    // load the google API
                    gapi.load("auth2", () => {
                        this.auth2 = gapi.auth2.init({
                            client_id: config.clientid,
                            cookiepolicy: "single_host_origin"
                        });

                        // set visible and enable the button
                        this.disabled = false;

                        // run change detection
                        // this.changeDetectorRef.detectChanges();
                    });
                },
                error => {
                    this.disabled = true;
                }
            );
        }
    }

    /**
     * get the google token
     *
     * @param event
     */
    public signIn(event) {
        event.preventDefault();
        event.stopPropagation();
        Promise.resolve(this.auth2.signIn())
            .then((googleUser) => {
                let profileEmail = this.auth2.currentUser.get().getBasicProfile().getEmail();
                if (!this.authenticatedUser || (this.authenticatedUser && this.authenticatedUser == profileEmail)) {
                    this.token.emit(googleUser.getAuthResponse().id_token);
                } else if (this.authenticatedUser && this.authenticatedUser != profileEmail) {
                    this.toast.sendToast('Wrong username', 'warning', 'usernames do not match, pleas elogin with the proper user');
                }
            })
            .catch((error: { error: string }) => {
                this.toast.sendToast('Error with Google Login', 'error');
            });
    }
}
