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
 * @module ModuleSpiceAttachments
 */
import {
    Component, OnInit, Input, NgZone, Output, EventEmitter, ViewChild, ViewContainerRef, Renderer2, Injector
} from '@angular/core';
import {backend} from "../../../services/backend.service";

/**
 * displays a quicknote that is read in teh stream
 */
@Component({
    templateUrl: './src/include/spiceattachments/templates/spiceattachmentstats.html',
})
export class SpiceAttachmentStats {

    private analysisresults: any[] = [];

    constructor(private backend: backend) {
        this.analyze();
    }

    /**
     * call the backend to get the analysis results
     *
     * @private
     */
    private analyze() {
        this.analysisresults = [];
        this.backend.getRequest('common/spiceattachments/admin').subscribe(res => {
            for (let module in res) {
                this.analysisresults.push({
                    module: module,
                    count: res[module]
                });
            }
        });
    }

    /**
     * getter for the total count
     */
    get totalcount() {
        let total = 0;
        for (let f of this.analysisresults) {
            total += parseInt(f.count, 10);
        }
        return total;
    }


    /**
     * call the backend to get the analysis results
     *
     * @private
     */
    private delete() {
        this.backend.postRequest('common/spiceattachments/admin/cleanup').subscribe(res => {
            this.analyze();
        });
    }
}
