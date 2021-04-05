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
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {configurationService} from '../../services/configuration.service';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {Subscription} from 'rxjs';

@Component({
    selector: 'global-header-image',
    templateUrl: './src/globalcomponents/templates/globalheaderimage.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GlobalHeaderImage {

    /**
     * Default image url.
     */
    private defaultImageUrl = 'config/headerimage';

    /**
     * The URL for the image tag:
     * Either a base64 string from the CRM config (if available) or the default image url.
     */
    private imageUrl: SafeResourceUrl | string = this.defaultImageUrl;

    /**
     * Subscription to configuration service.
     */
    private subscription: Subscription;

    constructor(private sanitizer: DomSanitizer, private configuration: configurationService) {

        // Set the image url in case there is a CRM config for that:
        if (this.configuration.hasCapabilityConfig('theme')) this.setImageUrl();

        // Update the image url in case the configuration data has changed:
        this.subscription = this.configuration.loaded$.subscribe(loaded => {
                if (loaded) this.setImageUrl();
            }
        );

    }

    /**
     * Update the image url  an there is a specific header image defined.
     */
    private setImageUrl(): void {
        // Update the image url in case the configuration data has changed an there is a specific header image defined.
        if (this.configuration.getCapabilityConfig('theme').header_image) {
            this.imageUrl = this.sanitizer.bypassSecurityTrustResourceUrl('data:' + this.configuration.getCapabilityConfig('theme').header_image);
        } else {
            this.imageUrl = this.defaultImageUrl;
        }
    }

    /**
     * Unsubscribe from the configuration service when the component is destroyed.
     */
    public ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

}
