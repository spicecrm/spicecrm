/**
 * @module ModuleSalesPlanning
 */
import {Component, Injector} from '@angular/core';
import {Observable, Subject} from "rxjs";
import {language} from "../../../services/language.service";
import {metadata} from "../../../services/metadata.service";

@Component({
    templateUrl: './src/modules/salesplanning/templates/salesplanningtoolcontentnotemodal.html',
})

export class SalesPlanningToolContentNoteModal {
    public self: any = {};
    public canEdit: boolean = false;
    public nodeInfo: any = {};
    public doSave: Observable<boolean> = new Observable<boolean>();
    public doSaveSubject: Subject<boolean> = new Subject<boolean>();

    constructor(private language: language) {
        this.doSave = this.doSaveSubject.asObservable();

    }

    /*
    * @reset notice
    */
    private clear() {
        if (!this.canEdit) return;
        this.nodeInfo.notice = '';
    }

    /*
    * @destroy self
    */
    private close() {
        this.self.destroy();
    }

    /*
    * @next doSaveSubject: boolean = true
    * @complete doSaveSubject
    * @close
    */
    private save() {
        if (!this.canEdit) return;
        this.doSaveSubject.next(true);
        this.doSaveSubject.complete();
        this.close();
    }
}
