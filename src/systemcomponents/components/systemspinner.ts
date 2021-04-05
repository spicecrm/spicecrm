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
 * @module SystemComponents
 */
import {Component, Input, OnInit} from '@angular/core';

/**
 * a loading spinner that can be rendered while a component is loading
 */
@Component({
    selector: 'system-spinner',
    templateUrl: './src/systemcomponents/templates/systemspinner.html'
})
export class SystemSpinner implements OnInit {

    /**
     * the size of the spinner in pixel
     */
    @Input() private size: number = 0;

    /**
     * an optional paramater for the border with in pixel
     */
    @Input() private border: number = 0;

    /**
     * set to true to inverse the spinner color schema
     */
    @Input() private inverse: string = 'false';

    /**
     * @ignore
     */
    private spinnerStyle: any = {};

    public ngOnInit() {
        let            styleObj = {};

        if (this.size != 0
        ) {
            this.spinnerStyle.width = this.size + 'px';
            this.spinnerStyle.height = this.size + 'px';
        }

        if (this.border != 0) {
            this.spinnerStyle['border-width'] = this.border + 'px';
        }

        if (this.inverse == 'true') {
            this.spinnerStyle['border-right-color'] = '#fff';
            this.spinnerStyle['border-left-color'] = '#fff';
            this.spinnerStyle['border-bottom-color'] = '#fff';
        }
        return styleObj;
    }
}
