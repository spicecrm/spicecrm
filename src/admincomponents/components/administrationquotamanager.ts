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
 * @module AdminComponentsModule
 */
import {Component, Pipe, PipeTransform, OnInit} from '@angular/core';
import {backend} from '../../services/backend.service';
import {Observable, Subject} from "rxjs";

/**
* @ignore
*/
/**
* @ignore
*/
declare var moment: any;

@Component({
    selector: 'administration-quotamanager',
    templateUrl: './src/admincomponents/templates/administrationquotamanager.html'
})
export class AdministrationQuotaManager implements OnInit {

    users: Array<any> = [];
    monthlyQuotas: object = {};
    quotas: Array<any> = [];
    yearlyQuotas: object = {};
    year: number = new Date().getFullYear();
    monthNamesList: Array<string> = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    yearsList: Array<number> = [];

    constructor(private backend: backend) {
    }

    ngOnInit(): void {
        this.getYears();
        this.getQuotaUsers();
    }

    getYears() {
        let thisYear = new Date().getFullYear();
        for (let year = thisYear - 2; year < thisYear + 7; year++) {
            this.yearsList.push(year);
        }
    }

    getQuotaUsers() {
        this.backend.getRequest('quotamanager/users').subscribe(data => {
            let i = 0;
            for (let entry of data) {
                this.users.push({
                    id: entry.id,
                    mode: '',
                    data: entry
                });
                i++;
            }
            this.getQuotas().subscribe();
        });
    }

    getQuotas(): Observable<Array<any>> {
        let responseSubject = new Subject<Array<any>>();
        this.backend.getRequest('quotamanager/quotas/' + this.year).subscribe(data => {
            this.quotas = data;
            this.monthlyQuotas = {};
            this.yearlyQuotas = {};
            for (let entry of data) {
                let userId: string = entry.assigned_user_id;
                let monthlyQuota: number = Math.round(entry.sales_quota);
                let monthIndex: number = entry.period - 1;
                if (!this.monthlyQuotas[userId]) {
                    this.monthlyQuotas[userId] = new Array(12);
                }
                this.monthlyQuotas[userId][monthIndex] = monthlyQuota;
                if (!this.yearlyQuotas[userId]) {
                    this.yearlyQuotas[userId] = 0;
                }
                this.yearlyQuotas[userId] += monthlyQuota;
            }
            responseSubject.next(this.users);
            responseSubject.complete()
            for (let user of this.users) {
                let userId = user.data.id;
                if (!this.monthlyQuotas[userId]) {
                    this.monthlyQuotas[userId] = new Array(12);
                }
                if (!this.yearlyQuotas[userId]) {
                    this.yearlyQuotas[userId] = 0;
                }
            }
        });
        return responseSubject.asObservable();
    }

    updateQuota(event, userId: string, monthIndex: number) {
        let newQuota = event.target.value ? +event.target.value : 0;
        let oldQuota = this.monthlyQuotas[userId][monthIndex];
        oldQuota = oldQuota ? oldQuota : 0;
        this.yearlyQuotas[userId] -= oldQuota - newQuota;
        if (newQuota > 0) {
            this.monthlyQuotas[userId][monthIndex] = newQuota;
            // console.log(this.monthlyQuotas);
            this.backend.postRequest('quotamanager/quota/' + userId
                + '/' + this.year
                + '/' + (monthIndex + 1)
                + '/' + newQuota);
        } else {
            delete this.monthlyQuotas[userId][monthIndex];
            this.backend.deleteRequest('quotamanager/quota/' + userId
                + '/' + this.year
                + '/' + (monthIndex + 1));
        }
    }

}
