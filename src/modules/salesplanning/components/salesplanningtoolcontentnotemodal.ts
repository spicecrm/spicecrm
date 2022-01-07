/**
 * @module ModuleSalesPlanning
 */
import {Component, Injector} from '@angular/core';
import {Observable, Subject} from "rxjs";
import {language} from "../../../services/language.service";
import {metadata} from "../../../services/metadata.service";

@Component({
    templateUrl: '../templates/salesplanningtoolcontentnotemodal.html',
})

export class SalesPlanningToolContentNoteModal {
    public self: any = {};
    public canEdit: boolean = false;
    public nodeInfo: any = {};
    public doSave: Observable<boolean> = new Observable<boolean>();
    public doSaveSubject: Subject<boolean> = new Subject<boolean>();

    constructor(public language: language) {
        this.doSave = this.doSaveSubject.asObservable();

    }

    /*
    * @reset notice
    */
    public clear() {
        if (!this.canEdit) return;
        this.nodeInfo.notice = '';
    }

    /*
    * @destroy self
    */
    public close() {
        this.self.destroy();
    }

    /*
    * @next doSaveSubject: boolean = true
    * @complete doSaveSubject
    * @close
    */
    public save() {
        if (!this.canEdit) return;
        this.doSaveSubject.next(true);
        this.doSaveSubject.complete();
        this.close();
    }
}
