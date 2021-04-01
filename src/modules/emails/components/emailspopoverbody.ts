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
 * @module ModuleActivities
 */
import {
    AfterViewInit,
    ComponentFactoryResolver,
    Component,
    ElementRef,
    NgModule,
    ViewChild,
    ViewContainerRef,
    OnInit,
    OnDestroy
} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';


@Component({
    templateUrl: './src/modules/emails/templates/emailspopoverbody.html',
})
export class EmailsPopoverBody {

    /**
     *
     */
    private _sanitizedValue;

    /**
     * the cached full html code to prevent "flickering" of the iframe (change detection)
     */
    private fullValue_cached: string;
    private fullValue: string = '';

    constructor(private model: model, private language: language, private sanitized: DomSanitizer) {
    }


    /**
     * get the html representation of the corresponding value
     * SPICEUI-88 - to prevent "flickering" of the iframe displaying this value, the value will be cached and should be rebuild on change
     * @returns {any}
     */
    get emailbody() {
        return this.model.getFieldValue('body');
    }

    get sanitizedValue() {
        if (this.emailbody) {
            if (this.emailbody.includes('</html>')) {
                this.fullValue = this.emailbody;
            } else {
                // added <base target="_blank"> so all links open in new window
                this.fullValue = `<html><body class="spice">${this.emailbody}</body></html>`;
            }
        }

        // if value changed, generate sanitized html value
        if (this.fullValue != this.fullValue_cached) {
            this._sanitizedValue = this.sanitized.bypassSecurityTrustResourceUrl(this.fullValue ? 'data:text/html;charset=UTF-8,' + encodeURIComponent(this.fullValue) : '');
            this.fullValue_cached = this.fullValue;
        }
        return this._sanitizedValue;
    }
}
