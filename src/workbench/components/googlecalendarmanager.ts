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
