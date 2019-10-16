/**
 * @module AdminComponentsModule
 */
import {Component} from '@angular/core';
import {language} from '../../services/language.service';
import {Observable, Subject} from "rxjs";


@Component({
    templateUrl: './src/admincomponents/templates/administrationftsmanagerindexmodal.html'
})
export class AdministrationFtsManagerIndexModal {

    private response: Observable<any>;
    private responseSubject: Subject<any>;
    private settings: any = {};
    public self: any = {};

    constructor(private language: language) {
        this.responseSubject = new Subject<object>();
        this.response = this.responseSubject.asObservable();
        this.settings.bulkAmount = -1;
    }

    private cancel() {
        this.responseSubject.next(false);
        this.responseSubject.complete();
        this.self.destroy();
    }

    private start() {
        this.responseSubject.next(this.settings);
        this.responseSubject.complete();
        this.self.destroy();
    }
}

