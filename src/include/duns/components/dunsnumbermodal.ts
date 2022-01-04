/**
 * @module ModuleDuns
 */
import {Component} from "@angular/core";
import {metadata} from "../../../services/metadata.service";
import {model} from "../../../services/model.service";
import {backend} from "../../../services/backend.service";
import {language} from "../../../services/language.service";
import {Observable, Subject} from "rxjs";

@Component({
    selector: "duns-number-modal",
    templateUrl: "../templates/dunsnumbermodal.html"
})
export class DunsNumberModal {

    public self: any = {};
    public isLoading: boolean = false;
    public componentconfig: any = {};
    public fieldsetFields: any[] = [];
    public results: any[] = [];
    public selectedItem: string;
    public response: Observable<string>;
    public responseSubject: Subject<any>;

    constructor(public language: language, public backend: backend, public metadata: metadata, public model: model) {
        this.responseSubject = new Subject<any>();
        this.response = this.responseSubject.asObservable();
    }

    public ngOnInit() {
        let conf = this.metadata.getComponentConfig('DunsNumberModal', this.model.module);
        this.fieldsetFields = this.metadata.getFieldSetFields(conf.fieldset);
    }

    public confirm() {
        this.responseSubject.next(this.selectedItem);
        this.responseSubject.complete();
        this.self.destroy();
    }

    public notFound() {
        this.responseSubject.next({duns: 'none'});
        this.responseSubject.complete();
        this.self.destroy();
    }

    public selectItem(item) {
        this.selectedItem = this.selectedItem == item ? undefined : item;
    }

    public rowClass(item) {
        return this.selectedItem == item ? 'slds-is-selected' : '';
    }

    public cancel() {
        this.responseSubject.next();
        this.responseSubject.complete();
        this.self.destroy();
    }

    public trackByFn(index, item) {
        return index;
    }
}
