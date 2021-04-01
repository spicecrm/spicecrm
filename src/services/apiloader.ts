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
 * @module services
 */
import {Injectable} from '@angular/core';

import {configurationService} from './configuration.service';
import {broadcast} from './broadcast.service';

@Injectable()
export class googleapiloader {

    apis: Array<any> = [];
    private _apiLoadingPromise: Promise<any>;

    constructor(private broadcast: broadcast, private configuration: configurationService) {
    }

    private _loadScript(): void {
        let script = (<any>document).createElement('script');
        script.async = true;
        script.defer = true;
        script.src = 'https://maps.googleapis.com/maps/api/js?callback=__onGoogleLoaded&key=' + this.configuration.data.googleAPI;
        script.type = 'text/javascript';

        (<any>document).getElementsByTagName('head')[0].appendChild(script);
    }

    isApiLoaded(): boolean {
        return (<any>window).google && (<any>window).google.maps ? true : false;
    }

    loadApi(): void {
        if (!this._apiLoadingPromise) {
            this._apiLoadingPromise = new Promise((resolve) => {
                (<any>window)['__onGoogleLoaded'] = (ev) => {
                    resolve('google maps api loaded');
                    this.broadcast.broadcastMessage('googleapiloader.maps');
                }

                this._loadScript();
            })
        }
    }
}
