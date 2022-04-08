/**
 * @module AdminComponentsModule
 */
import {Component} from '@angular/core';
import {language} from '../../services/language.service';
import {Observable, Subject} from "rxjs";


@Component({
    templateUrl: '../templates/administrationftsmanagerindexmodal.html'
})
export class AdministrationFtsManagerIndexModal {

    public response: Observable<any>;
    public responseSubject: Subject<any>;
    public settings: any = {};
    public self: any = {};

    constructor(public language: language) {
        this.responseSubject = new Subject<object>();
        this.response = this.responseSubject.asObservable();
        this.settings.bulkAmount = -1;
    }

    public cancel() {
        this.responseSubject.next(false);
        this.responseSubject.complete();
        this.self.destroy();
    }

    public start() {
        this.responseSubject.next(this.settings);
        this.responseSubject.complete();
        this.self.destroy();
    }
}

