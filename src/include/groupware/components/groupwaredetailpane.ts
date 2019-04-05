import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
// import AsyncResultStatus = Office.AsyncResultStatus;
import {Subject, Observable} from 'rxjs';
import {Router} from '@angular/router';

import {GroupwareService} from '../services/groupware.service';
import {backend} from "../../../services/backend.service";

@Component({
    selector: 'groupware-detail-pane',
    templateUrl: './src/include/groupware/templates/groupwaredetailpane.html'
})
export class GroupwareDetailPane implements OnInit {

    private beans: any = [];

    constructor(
        private backend: backend,
        private groupware: GroupwareService,
        private http: HttpClient,
        private router: Router,
    ) {
    }

    public ngOnInit(): void {
        console.log('detail pane on init');

        this.loadBeans().subscribe(
            (res) => {
                if (res.length == 1) {
                    // just one bean found -> show it
                    console.log('one bean found. redirecting');
                    this.router.navigate(['module/' + res[0].module + '/' + res[0].id]);
                }
            },
            (err) => {
                console.log(err);
            }
        );
    }

    private loadBeans(): Observable<any> {
        let responseSubject = new Subject<any>();
        let payload = this.groupware.getEmailAddressData();

        this.backend.postRequest('EmailAddress/searchBeans', {}, payload).subscribe(
            (res: any) => {
                for (let item in res) {
                    this.beans.push(res[item]);
                }
                responseSubject.next(this.beans);
                responseSubject.complete();
                // this.beansloaded$.emit(true);
            },
            (err) => {
                responseSubject.error(err);
            }
        );

        return responseSubject.asObservable();
    }

    private showBean() {
        if (this.beans.length == 0) {
            // no beans found
            console.log('no beans found');
        } else {
            // multiple beans found -> show a list
            console.log('multiple beans found');
        }
    }
}
