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
 * @module SystemComponents
 */
import {Component, Input} from '@angular/core';

@Component({
    selector: 'system-modal-content',
    templateUrl: './src/systemcomponents/templates/systemmodalcontent.html',
    host: {
        '[class]': 'this.marginclass'
    }
})
export class SystemModalContent {

    /**
     * sets the margin for the content
     */
    @Input() private margin: 'large'|'medium'|'small'|'x-small'|'xx-small'|'xxx-small'|'none' = 'medium';

    /**
     * if set to true the modal will consume as muchheight as possible
     */
    @Input() private grow: boolean = false;

    /**
     * an attribute that can be set and doies not require the value true poassed in
     * @param value
     */
    @Input('system-modal-content-grow') set inputGrow(value) {
        if (value === false) {
            this.grow = false;
        } else {
            this.grow = true;
        }
    }

    /**
     * returs the margin class and the groth for the modal
     */
    get marginclass() {
        let dynamicclass = 'slds-modal__content slds-scrollable--y slds-p-around--' + this.margin;

        if (this.grow) {
            dynamicclass += ' slds-grow';
        }

        return dynamicclass;
    }
}
