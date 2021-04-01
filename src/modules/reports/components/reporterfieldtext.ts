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
 * @module ModuleReports
 */
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";

/**
 * display formatted report record value with text
 */
@Component({
    selector: 'reporter-field-text',
    templateUrl: './src/modules/reports/templates/reporterfieldtext.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReporterFieldText {
    /**
     * report full record
     */
    private record: any = {};
    /**
     * report field
     */
    private field: any = {};
    /**
     * display value
     */
    private value: SafeHtml = '';

    constructor(private sanitizer: DomSanitizer) {
    }

    /**
     * call to set the display value
     */
    public ngOnInit() {
        this.setFormattedFieldValue();
    }

    /**
     * set formatted field value
     */
    private setFormattedFieldValue() {

        if (!!this.record[this.field.fieldid]) {
            this.value = this.sanitizer.bypassSecurityTrustHtml(this.record[this.field.fieldid].replace(/(?:\r\n|\r|\n)/g, '<br>'));

        }
    }
}
