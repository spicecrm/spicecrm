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
import {Component, Input} from "@angular/core";
import {language} from "../../services/language.service";

/**
 * displays a progress ring that is filling or draining
 */
@Component({
    selector: "system-progress-ring",
    templateUrl: "./src/systemcomponents/templates/systemprogressring.html"
})
export class SystemProgressRing {
    /**
     * the completion percentage
     */
    @Input() private percentage: number = 100;

    /**
     * the size of the ring in px
     */
    @Input() private size: number = 24;

    /**
     * a status indicator:
     *  - warning turns yellow
     *  - expired turns red
     */
    @Input() private status: "" | "warning" | "expired" = "";

    /**
     * an optional background color if the ring is rendered in a contect with different background
     *
     * @private
     */
    @Input() private backgroundcolor: string;

    constructor(private language: language) {
    }

    /**
     * @ignore
     */
    get style() {
        return {
            height: this.size + 'px',
            width: this.size + 'px'
        };
    }

    /**
     * gets the colos for the inner ring
     */
    get innerStyle() {
        if (this.backgroundcolor) {
            return {background: this.backgroundcolor};
        }
        return {};
    }

    /**
     * @ignore
     */
    get fillPercentage() {
        return this.percentage / 100;
    }

    /**
     * internal helper to calculate the SVG
     */
    get d() {
        return "M 1 0 A 1 1 0 " + (this.percentage > 50 ? '1' : '0') + " 1 " + Math.cos(2 * Math.PI * this.fillPercentage) + " " + Math.sin(2 * Math.PI * this.fillPercentage) + " L 0 0";
    }

    /**
     * a getter to detemrine the proper SLDS Classes
     */
    get ringClass() {

        if (this.status == '' && this.percentage >= 100) return 'slds-progress-ring_complete';

        switch (this.status) {
            case 'warning':
                return 'slds-progress-ring_warning';
            case 'expired':
                return 'slds-progress-ring_expired';
        }
    }

    /**
     * a helper to dtermine if the status is completed
     */
    get iconstatus() {
        return (this.percentage >= 100) ? 'complete' : this.status;
    }
}
