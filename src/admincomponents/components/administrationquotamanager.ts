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
    templateUrl: '../templates/administrationquotamanager.html'
})
export class AdministrationQuotaManager implements OnInit {

    users: Array<any> = [];
    monthlyQuotas: object = {};
    quotas: Array<any> = [];
    yearlyQuotas: object = {};
    year: number = new Date().getFullYear();
    monthNamesList: Array<string> = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    yearsList: Array<number> = [];

    constructor(public backend: backend) {
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
        this.backend.getRequest('module/QuotaManager/users').subscribe(data => {
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
        this.backend.getRequest('module/QuotaManager/quotas/' + this.year).subscribe(data => {
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
            this.backend.postRequest('module/QuotaManager/quota/' + userId
                + '/' + this.year
                + '/' + (monthIndex + 1)
                + '/' + newQuota);
        } else {
            delete this.monthlyQuotas[userId][monthIndex];
            this.backend.deleteRequest('module/QuotaManager/quota/' + userId
                + '/' + this.year
                + '/' + (monthIndex + 1));
        }
    }

}
