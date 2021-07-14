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
import {Component, Input} from "@angular/core";

/**
 * Displays a progress list indicator
 */
@Component({
    selector: "system-progress-list",
    templateUrl: "./src/systemcomponents/templates/systemprogresslist.html"
})
export class SystemProgressList {

    /**
     * The progress of completion.
     */
    @Input() private step: number = 0;

    /**
     * the steps to be displayed as labels
     *
     * @private
     */
    @Input() private steps: string[] = [];

    /**
     * internal var to keep the value if se shoudl display shaded
     * @private
     */
    private _shade: boolean = false;

    /**
     * inpout to set the shade param with a setter so we can simply checkl the existence of the attribute
     *
     * @param val
     */
    @Input('system-progress-list-shade') set shade(val: boolean) {
        if (val === false) {
            this._shade = false;
        } else {
            this._shade = true;
        }
    }

    constructor() {
    }

    /**
     * returns the class for the step indicator
     *
     * @param step
     * @private
     */
    private getStepClass(step: string) {
        let thisIndex = this.steps.indexOf(step);
        if (thisIndex == this.step) {
            return 'slds-is-active';
        }
        if (thisIndex < this.step) {
            return 'slds-is-completed';
        }
    }


    /**
     * return if the current step is complete
     * @param step
     * @private
     */
    private getStepComplete(step: string) {
        let thisIndex = this.steps.indexOf(step);
        if (thisIndex < this.step) {
            return true;
        }
        return false;
    }

    /**
     * the width of the progressbar
     */
    get progressBarWidth() {
        return {
            width: (this.step / (this.steps.length - 1) * 100) + '%'
        };
    }

}
