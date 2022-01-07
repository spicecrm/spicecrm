/**
 * @module AdminComponentsModule
 */
import {Component, Pipe, PipeTransform, OnInit, Input} from '@angular/core';
import {backend} from '../../services/backend.service';
import {Observable, Subject} from "rxjs";

@Component({
    selector: 'administration-quotamanager-field',
    templateUrl: '../templates/administrationquotamanagerfield.html'
})
export class AdministrationQuotaManagerField {
    @Input() userid: string = "";
    @Input() monthindex: number = 0;
    @Input() year: number = 0;
    @Input() data: Array<any> = [];

    constructor(public backend: backend) {
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
