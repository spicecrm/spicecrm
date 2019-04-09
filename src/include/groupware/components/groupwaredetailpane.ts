import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Subject, Observable} from 'rxjs';
import {Router} from '@angular/router';

import {GroupwareService} from '../services/groupware.service';
import {backend} from "../../../services/backend.service";

/**
 * Outlook add-in detail pane showing a list of beans that use the email addresses found in the email.
 * In case there is just one such bean, the details of it will be shown.
 */
@Component({
    selector: 'groupware-detail-pane',
    templateUrl: './src/include/groupware/templates/groupwaredetailpane.html'
})
export class GroupwareDetailPane implements OnInit {

    private beans: any = [];
    private loading: boolean = false;

    constructor(
        private backend: backend,
        private groupware: GroupwareService,
        private http: HttpClient,
        private router: Router,
    ) {
    }

    public ngOnInit(): void {
        this.loading = true;

        this.loadBeans().subscribe(
            (res) => {
                if (res.length == 1) {
                    // just one bean found -> show it
                    this.router.navigate(['module/' + res[0].module + '/' + res[0].id]);
                }
                this.loading = false;
            },
            (err) => {
                // todo logger service
                console.log(err);

                this.loading = false;
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
            },
            (err) => {
                responseSubject.error(err);
            }
        );

        return responseSubject.asObservable();
    }
}
