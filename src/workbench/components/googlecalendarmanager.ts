/**
 * @module WorkbenchModule
 */
import {Component} from "@angular/core";
import {backend} from "../../services/backend.service";
import {language} from "../../services/language.service";
import {model} from "../../services/model.service";
import {toast} from "../../services/toast.service";
import {view} from "../../services/view.service";

import {Subject} from 'rxjs';

@Component({
    providers: [model, view],
    selector: "google-calendar-manager",
    templateUrl: "../templates/googlecalendarmanager.html",
})
export class GoogleCalendarManager {
    public beans: any[] = [];
    public calendars: any[] = [];
    public beanMappings: any[] = [];

    constructor(
        public backend: backend,
        public language: language,
        public model: model,
        public toast: toast,
    ) {
        // todo check if logged in with google account

        this.getBeans();
        this.getCalendars();
        this.getBeanMappings();
    }

    public saveBeanMappings() {
        let postData = {
            bean_mappings: this.beanMappings
        };

        this.backend.postRequest('channels/groupware/gsuite/calendar/beanmappings', {}, postData)
            .subscribe((res: any) => {
                this.toast.sendToast('Bean Mappings saved');
            }
        );
    }

    public startSync() {
        /**
         * google/calendar/notifications/startSync route was missing
         * replaces with /channels/groupware/gsuite/calendar/sync
         * not sure if it works
         */
        this.backend.getRequest('channels/groupware/gsuite/calendar/sync').
            subscribe((res: any) => {
                if (res.result == true) {
                    this.toast.sendToast('Google Calendar synchronization started.', 'success');
                } else {
                    this.toast.sendToast(res.error, 'error');
                }
        });
    }

    public addMapping() {
        if (!this.beanMappings) {
            this.beanMappings = [];
        }

        this.beanMappings.push({
            id:       this.model.generateGuid(),
            deleted:  false,
            bean:     {
                module: '',
                class:  '',
            },
            calendar: {
                id:   '',
                name: '',
            },
        });
    }

    public removeMapping(mappingId: string) {
        this.beanMappings.forEach((mapping) => {
            if (mapping.id === mappingId) {
                mapping.deleted = true;
            }
        });
    }

    public getBeans() {
        let responseSubject = new Subject<any[]>();

        this.backend.getRequest('channels/groupware/gsuite/calendar/beans').subscribe(
            (response: any) => {
                if (response.result === true) {
                    this.beans = response.beans;
                }

                responseSubject.next(response);
                responseSubject.complete();
            },
            (err: any) => {

            }
        );

        return responseSubject.asObservable();
    }

    public getCalendars() {
        let responseSubject = new Subject<any[]>();

        this.backend.getRequest('channels/groupware/gsuite/calendar/calendars').subscribe(
            (response: any) => {
                if (response.result === true) {
                    this.calendars = response.calendars;
                }

                responseSubject.next(response);
                responseSubject.complete();
            },
            (err: any) => {

            },
        );

        return responseSubject.asObservable();
    }

    public getBeanMappings() {
        let responseSubject = new Subject<any[]>();

        this.backend.getRequest('channels/groupware/gsuite/calendar/beanmappings').subscribe(
            (response: any) => {
                if (response.result === true) {
                    // this.beanMappings = response.bean_mappings;

                    this.beanMappings = Object.keys(response.bean_mappings).map((index) => {
                        let mapping = response.bean_mappings[index];
                        return mapping;
                    });
                }

                responseSubject.next(response);
                responseSubject.complete();
            },
            (err: any) => {

            },
        );

        return responseSubject.asObservable();
    }
}
