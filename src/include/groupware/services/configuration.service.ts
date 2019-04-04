import {EventEmitter, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Subject, Observable} from 'rxjs';
import {backend} from "../../../services/backend.service";
// import AsyncResultStatus = Office.AsyncResultStatus;

declare var Office: any;

@Injectable()
export class configuration {
    private settings = Office.context.roamingSettings;

    public username: string;
    public password: string;

    public serviceRequest = {
        attachmentToken: '',
        ewsUrl: '',
        attachments: [],
    };

    constructor(
        private http: HttpClient,
        private backend: backend,
    ) {
        this.loadSettings();
    }

    public loadSettings() {
        this.username = this.settings.get('username');
        this.password = this.settings.get('password');
    }

    public hasSettings() {
        return this.username != '' && this.password != '';
    }

    public saveSettings(): Observable<any> {
        let retSubject = new Subject();

        this.settings.set('username', this.username);
        this.settings.set('password', this.password);

        this.settings.saveAsync(result => {
            if (result.status == Office.AsyncResultStatus.Failed) {
                retSubject.error('failed saving settings');
                retSubject.complete();
            }

            if (result.status == Office.AsyncResultStatus.Succeeded) {
                retSubject.next(true);
                retSubject.complete();
            }
        });

        return retSubject.asObservable();
    }

    public testSettings(): Observable<any> {

        let retSubject = new Subject();

        this.backend.getRequest('login').subscribe(
            (res: any) => {
                // OK
                retSubject.next(true);
                retSubject.complete();
            },
            (err) => {
                retSubject.error(err);
                retSubject.complete();
            }
        );
        return retSubject.asObservable();
    }
}
