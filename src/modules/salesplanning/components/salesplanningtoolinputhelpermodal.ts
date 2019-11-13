/**
 * @module ModuleSalesPlanning
 */
import {Component} from '@angular/core';
import {language} from '../../../services/language.service';
import {Observable, Subject} from "rxjs";

@Component({
    templateUrl: './src/modules/salesplanning/templates/salesplanningtoolinputhelpermodal.html'
})

export class SalesPlanningToolInputHelperModal {

    public self: any = {};
    public allFields: any[] = [];
    public periods: any[] = [];
    public data: any = {startPeriod: 0, fromField: 'fixed'};
    public response: Observable<any>;
    public responseSubject: Subject<any> = new Subject<object>();

    constructor(private language: language) {
        this.response = this.responseSubject.asObservable();
    }

    public ngOnInit() {
        this.data.endPeriod = this.periods.length -1;
    }
    get editableFields() {
        return this.allFields.filter(field => field.editable == '1');
    }
    private cancel() {
        this.responseSubject.next(false);
        this.responseSubject.complete();
        this.self.destroy();
    }

    private execute() {
        this.responseSubject.next(this.data);
        this.responseSubject.complete();
        this.self.destroy();
    }
}
