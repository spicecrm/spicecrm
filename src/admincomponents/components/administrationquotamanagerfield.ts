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
 * @module AdminComponentsModule
 */
import {Component, Pipe, PipeTransform, OnInit, Input} from '@angular/core';
import {backend} from '../../services/backend.service';
import {Observable, Subject} from "rxjs";

@Component({
    selector: 'administration-quotamanager-field',
    templateUrl: './src/admincomponents/templates/administrationquotamanagerfield.html'
})
export class AdministrationQuotaManagerField {
    @Input() userid: string = "";
    @Input() monthindex: number = 0;
    @Input() year: number = 0;
    @Input() data: Array<any> = [];

    constructor(private backend: backend) {
    }

    get value() {
        for (let entry of this.data) {
            if (entry
                && entry.assigned_user_id === this.userid
                && entry.period === "" + (this.monthindex + 1)) {
                return "" + Math.round(entry.sales_quota);
            }
        }
        return "";
    }

    set value(quota: string) {
        let index: number = 0;
        // console.log(event);
        //let quota: string = event.target.value;
        let quotaNumeric = +quota;
        for (let entry of this.data) {
            if (entry
                && entry.assigned_user_id === this.userid
                && entry.period === "" + (this.monthindex + 1)) {
                if (quotaNumeric > 0) {
                    this.data[index].sales_quota = quota;
                } else {
                    delete this.data[index];
                }
            }
            index++;
        }
        if (quotaNumeric > 0) {
            this.backend.postRequest('module/QuotaManager/quota/' + this.userid
                + '/' + this.year
                + '/' + (this.monthindex + 1)
                + '/' + quota).subscribe(_ => {
                // console.log("update to quota = " + quota);
            });
        } else {
            this.backend.deleteRequest('module/QuotaManager/quota/' + this.userid
                + '/' + this.year
                + '/' + (this.monthindex + 1));
        }
    }

    changeValue(event) {

    }
}