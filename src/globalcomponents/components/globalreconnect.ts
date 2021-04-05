/*
SpiceUI 2021.01.001

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
    Component, EventEmitter, OnDestroy, OnInit, Output
} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {configurationService} from '../../services/configuration.service';
import {loginService} from '../../services/login.service';
import {interval, Subscription} from "rxjs";

/**
 * a modal to prompt the user for the password to reconnect
 * this is rendered when an http request is failing
 * it tries to reconnect in 5 seconds interval
 */
@Component({
    selector: 'global-re-connect',
    templateUrl: './src/globalcomponents/templates/globalreconnect.html',
})
export class GlobalReConnect implements OnInit, OnDestroy {

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
    @Output() private connected: EventEmitter<boolean> = new EventEmitter<boolean>();

    /**
     * a timer to the reconnect check
     * @private
     */
    private timeToNextCheck: number = 500;

    /**
     * the subscription to countdown the time
     *
     * @private
     */
    private timerSubscription: Subscription;

    constructor(private http: HttpClient, private configuration: configurationService, private login: loginService) {

    }

    /**
     * initialize the next check
     */
    public ngOnInit() {
        this.timerSubscription = interval(10).subscribe(x => {
            this.timeToNextCheck--;
            this.checkReconnect();
        });
    }

    /**
     * unsubscribe
     */
    public ngOnDestroy() {
        this.timerSubscription.unsubscribe();
    }

    /**
     * check if we shoudl check for reconnection
     *
     * @private
     */
    private checkReconnect() {
        if (this.timeToNextCheck == 0) {
            this.reconnect();
        }
    }

    get progress() {
        return this.timeToNextCheck / 5;
    }

    /**
     * checks the reconnect calling sysinfo
     * if successful the modal is closed if not the timer is reset
     *
     * @private
     */
    private reconnect() {
        let loginUrl: string = this.configuration.getBackendUrl() + '/sysinfo';
        this.http.get(loginUrl).subscribe(
            (res: any) => {
                this.connected.emit(true);
                this.close();
            },
            (err: any) => {
                console.log(err);
                this.timeToNextCheck = 500;
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
