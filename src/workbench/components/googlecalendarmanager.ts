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
    templateUrl: "./src/workbench/templates/googlecalendarmanager.html",
})
export class GoogleCalendarManager {
    public beans: any[] = [];
    public calendars: any[] = [];
    public beanMappings: any[] = [];

    constructor(
        private backend: backend,
        private language: language,
        private model: model,
        private toast: toast,
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

        this.backend.postRequest('google/calendar/savebeanmappings', {}, postData)
            .subscribe((res: any) => {
                this.toast.sendToast('Bean Mappings saved');
            }
        );
    }

    public startSync() {
        this.backend.getRequest('google/calendar/notifications/startSync').
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
        console.log(mappingId);
        this.beanMappings.forEach((mapping) => {
            if (mapping.id === mappingId) {
                mapping.deleted = true;
            }
        });
    }

    private getBeans() {
        let responseSubject = new Subject<any[]>();

        this.backend.getRequest('google/calendar/getbeans').subscribe(
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

    private getCalendars() {
        let responseSubject = new Subject<any[]>();

        this.backend.getRequest('google/calendar/getcalendars').subscribe(
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

    private getBeanMappings() {
        let responseSubject = new Subject<any[]>();

        this.backend.getRequest('google/calendar/getbeanmappings').subscribe(
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
