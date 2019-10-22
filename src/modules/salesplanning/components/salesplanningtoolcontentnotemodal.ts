/**
 * @module ModuleSalesPlanning
 */
import {Component, Injector} from '@angular/core';
import {Observable, Subject} from "rxjs";
import {language} from "../../../services/language.service";

@Component({
    templateUrl: './src/modules/salesplanning/templates/salesplanningtoolcontentnotemodal.html',
})

export class SalesPlanningToolContentNoteModal {
    public self: any = {};
    public nodeInfo: any = {};
    public doSave: Observable<boolean> = new Observable<boolean>();
    public doSaveSubject: Subject<boolean> = new Subject<boolean>();

    constructor(private language: language) {
        this.doSave = this.doSaveSubject.asObservable();

    }

    private clear() {
        this.nodeInfo.notice = '';
    }

    private close() {
        this.self.destroy();
    }

    private save() {
        this.doSaveSubject.next(true);
        this.doSaveSubject.complete();
        this.close();
    }
}
