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
 * @module ObjectComponents
 */

import {Subject} from "rxjs";

/**
 * @ignore
 */
declare var moment: any;

import {Component, OnInit} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {modellist} from '../../../services/modellist.service';
import {backend} from '../../../services/backend.service';

/**
 * renders in the list header action menu and offers the user the option to export the list to a targetlist
 */
@Component({
    templateUrl: './src/modules/sapidocs/templates/sapidocslistheaderactionsprocessmodal.html',
})
export class SAPIDOCsListHeaderActionsProcessModal implements OnInit {

    /**
     * reference to the modal itsel
     */
    private self: any;

    private count: number = 0;
    private processed: number = 0;
    private processedcomplete: number = 0;
    private processedfailed: number = 0;

    constructor(
        private language: language,
        private metadata: metadata,
        private model: model,
        private backend: backend,
        private modellist: modellist,
    ) {
    }

    public ngOnInit(): void {
        this.count = this.modellist.getSelectedIDs().length;
        if(this.count > 0) {
            this.processIDOCs().then(ret => {
                this.close();
            });
        } else {
            this.close();
        }
    }

    /**
     * process the idocs sequentially
     */
    private async processIDOCs(): Promise<boolean> {
        let ret = new Subject<boolean>();
        let selectedIds = this.modellist.getSelectedIDs();
        for (let selectedId of selectedIds) {
            await this.processIDOC(selectedId).then(res => {
                if (res) {
                    this.processedcomplete++;
                } else {
                    this.processedfailed++;
                }
            });
            this.processed++;

            // if we have processed all complete
            if (this.processed == this.count) {
                ret.next(true);
                ret.complete();
            }
        }
        return ret.toPromise();
    }

    /**
     * close the window
     */
    private close() {
        this.self.destroy();
    }

    /**
     * processes a single idoc
     */
    private async processIDOC(idocid): Promise<boolean> {
        let sub = new Subject<boolean>();
        this.backend.postRequest(`modules/SAPIdocs/${idocid}/process`).subscribe(
            success => {
                sub.next(true);
                sub.complete();
            },
            error => {
                sub.next(false);
                sub.complete();
            });
        return sub.toPromise();
    }

    /**
     * returns the style for the process bar with the progress percentage
     */
    get progressBarStyle() {
        return {
            width: this.percentage + '%'
        };
    }

    /**
     * calculates the completion percentage
     */
    get percentage() {
        return this.count > 0 ? Math.floor(this.processed / this.count * 100) : 0;
    }

}
