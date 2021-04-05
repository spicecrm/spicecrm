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
 * @module services
 */
import {Injectable, isDevMode} from '@angular/core';
import {session} from './session.service';

/**
 * no operation ...
 */
const noop = (): any => undefined;

/**
 * general service for logging
 */
@Injectable()
export class loggerService {

    private sessionService: session;

    /**
     * getter for
     */
    get info() {
        if (this.isDev()) return console.info.bind(console);
        else return noop;
    }

    get warn() {
        if (this.isDev()) return console.warn.bind(console);
        else return noop;
    }

    get log() {
        if (this.isDev()) return console.log.bind(console);
        else return noop;
    }

    get error() {
        if (this.isDev()) return console.error.bind(console);
        else return noop;
    }

    /**
     * @ignore
     *
     * returns if we are in angular in the developer mode
     */
    private isDev() {
        return isDevMode() || (this.sessionService && this.sessionService.isDev);
    }

    /**
     * set the session service. This is needed because the logger is instantiated before the session service. The sessionservice finds the logger service then and sets the session there.
     *
     * @param service the service itself
     */
    public setSession(service) {
        this.sessionService = service;
    }

}
