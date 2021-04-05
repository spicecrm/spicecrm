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
import {metadata} from "../../services/metadata.service";

@Component({
    selector: "system-icon-help-text",
    templateUrl: "./src/systemcomponents/templates/systemiconhelptext.html"
})
export class SystemIconHelpText {
    @Input() private icon: string = 'info';
    @Input() private file: string = './assets/icons/spicecrm.svg';
    @Input() private size: string = 'xx-small'; // possible: xx-small, x-small, small, large
    @Input() private popoverMaxWidth: string = '300px';
    @Input() private color: string = '#bbb';
    @Input() private hovercolor: string = '#5B5B5B';
    @Input() private desaturate: boolean = false;
    @Input() private addclasses: string = '';
    @Input() private divClass = 'slds-media__figure';

    /**
     * helpText string
     */
    @Input() private helpText: string = "";

    private showHelp: boolean = false;

    constructor(private metadata: metadata) {

    }

    /**
     * All Params for the icon-component (system-custom-icon)
     */
    get gicon() {
        if (this.icon) {
            return this.icon;
        }
    }

    get gfile() {
        if (this.file) {
            return this.file;
        }
    }

    get gsizeClass() {
        if (this.size) {
            return this.size;
        }
    }

    get gcolor() {
        if (this.color) {
            return this.color;
        }
    }

    get ghovercolor() {
        if (this.hovercolor) {
            return this.hovercolor;
        }
    }

    get gdesaturate() {
        if (this.desaturate) {
            return this.desaturate;
        }
    }

    get gaddClass() {
        if (this.addclasses) {
            return this.addclasses;
        }
    }

    get gdivClass() {
        if (this.divClass) {
            return this.divClass;
        }
    }

    get PopoverMaxWidth() {
        return this.popoverMaxWidth;
    }

    /**
     * it get the correct distance for the icon size
     */
    get bottomdistance() {
        if (this.size == "xx-small" || this.size == "x-small") {
            return ' 2.5em';
        }
        if (this.size == "small") {
            return ' 2.8em';
        }
        if (this.size == "large") {
            return ' 3.5em';
        }
    }

    get leftdistance() {
        if (this.size == "xx-small" || this.size == "x-small") {
            return '-65%';
        }
        if (this.size == "small") {
            return '-30%';
        }
        if (this.size == "large") {
            return '10%';
        }
    }


}
