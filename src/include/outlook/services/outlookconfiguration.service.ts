/**
 * @module Outlook
 */
import {Injectable} from '@angular/core';
import {Subject, Observable} from 'rxjs';
import {backend} from "../../../services/backend.service";

declare var Office: any;

/**
 * Outlook add-in configuration service. Used to store login data and save it in the roaming settings.
 */
@Injectable()
export class OutlookConfiguration {
    private settings = Office.context.roamingSettings;

    public username: string;
    public password: string;

    constructor(
        private backend: backend,
    ) {
        this.loadSettings();
    }

    /**
     * Loads the settings from roaming settings.
     */
    public loadSettings() {
        this.username = this.settings.get('username');
        this.password = this.settings.get('password');
    }

    /**
     * Checks if any of the settings are set.
     */
    public hasSettings() {
        return this.username && this.username != '' && this.password && this.password != '';
    }

    /**
     * Saves the settings from the form into roaming settings.
     */
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

    /**
     * Tests the login settings against the KREST endpoint.
     */
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
